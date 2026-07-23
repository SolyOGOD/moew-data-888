const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey12345!';
const accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

async function createProfileForUser(userId, displayName) {
  await db.query(
    'INSERT INTO profiles (user_id, display_name) VALUES (?, ?)',
    [userId, displayName]
  );
}

// Register a new user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please provide username, email, and password.' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const [result] = await db.query(
      'INSERT INTO users (username, password_hash, email, is_active) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 1]
    );

    await createProfileForUser(result.insertId, username);

    res.status(201).json({
      message: 'User registered successfully.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username or email and password.' });
  }

  try {
    const identifier = username.trim();
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: accessExpiry }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: refreshExpiry }
    );

    await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

    res.json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);

    if (users.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const user = users[0];

    try {
      jwt.verify(refreshToken, jwtSecret);
    } catch (error) {
      return res.status(403).json({ message: 'Refresh token expired or invalid.' });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: accessExpiry }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: refreshExpiry }
    );

    await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    const [result] = await db.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Invalid refresh token.' });
    }

    res.json({ message: 'Logout successful.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email, u.is_active, u.created_at, u.updated_at AS auth_updated_at,
        p.display_name, p.avatar_url, p.bio, p.phone, p.updated_at AS profile_updated_at
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_active: Boolean(user.is_active),
        created_at: user.created_at,
        updated_at: user.auth_updated_at,
        profile: {
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          bio: user.bio,
          phone: user.phone,
          updated_at: user.profile_updated_at
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { display_name, avatar_url, bio, phone } = req.body;
  const updates = {};

  if (display_name !== undefined) updates.display_name = String(display_name).trim();
  if (avatar_url !== undefined) updates.avatar_url = String(avatar_url).trim();
  if (bio !== undefined) updates.bio = String(bio).trim();
  if (phone !== undefined) updates.phone = String(phone).trim();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'At least one profile field is required.' });
  }

  try {
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const sql = `
      INSERT INTO profiles (user_id, ${Object.keys(updates).join(', ')}, updated_at)
      VALUES (?, ${Object.keys(updates).map(() => '?').join(', ')}, NOW())
      ON DUPLICATE KEY UPDATE ${fields}, updated_at = NOW()`;

    await db.query(sql, [req.user.id, ...values, ...values]);

    const [rows] = await db.query(
      'SELECT display_name, avatar_url, bio, phone, updated_at FROM profiles WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ profile: rows[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

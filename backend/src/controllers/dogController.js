const db = require('../config/db');

// Get all dogs (with filtering, sorting, searching)
exports.getAllDogs = async (req, res) => {
  try {
    const { name, gender, color, breed, status, sortBy, order } = req.query;

    let query = 'SELECT * FROM dogs WHERE 1=1';
    const queryParams = [];

    // Filter by name (search query)
    if (name) {
      query += ' AND name LIKE ?';
      queryParams.push(`%${name}%`);
    }

    // Filter by gender
    if (gender) {
      query += ' AND gender = ?';
      queryParams.push(gender);
    }

    // Filter by color
    if (color) {
      query += ' AND color LIKE ?';
      queryParams.push(`%${color}%`);
    }

    // Filter by breed
    if (breed) {
      query += ' AND breed LIKE ?';
      queryParams.push(`%${breed}%`);
    }

    // Filter by status
    if (status) {
      query += ' AND status = ?';
      queryParams.push(status);
    }

    // Sort configurations
    const validSortFields = ['name', 'age', 'breed', 'status', 'created_at'];
    const validOrders = ['ASC', 'DESC'];

    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = validOrders.includes(order?.toUpperCase()) ? order.toUpperCase() : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const [dogs] = await db.query(query, queryParams);
    res.json(dogs);
  } catch (error) {
    console.error('Fetch dogs error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get dog by ID
exports.getDogById = async (req, res) => {
  try {
    const [dogs] = await db.query('SELECT * FROM dogs WHERE id = ?', [req.params.id]);

    if (dogs.length === 0) {
      return res.status(404).json({ message: 'Dog not found.' });
    }

    res.json(dogs[0]);
  } catch (error) {
    console.error('Fetch dog error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Create a new dog record (protected)
exports.createDog = async (req, res) => {
  const { name, gender, color, age, breed, address, status, image_url } = req.body;

  if (!name || !gender) {
    return res.status(400).json({ message: 'Name and Gender are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO dogs (name, gender, color, age, breed, address, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, gender, color, age || null, breed || null, address || null, status || 'Active', image_url || null]
    );

    res.status(201).json({
      message: 'Dog record created successfully.',
      dogId: result.insertId
    });
  } catch (error) {
    console.error('Create dog error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Update an existing dog record (protected)
exports.updateDog = async (req, res) => {
  const { name, gender, color, age, breed, address, status, image_url } = req.body;
  const { id } = req.params;

  try {
    // Check if dog exists
    const [dogs] = await db.query('SELECT id FROM dogs WHERE id = ?', [id]);
    if (dogs.length === 0) {
      return res.status(404).json({ message: 'Dog not found.' });
    }

    // Update DB
    await db.query(
      'UPDATE dogs SET name = ?, gender = ?, color = ?, age = ?, breed = ?, address = ?, status = ?, image_url = ? WHERE id = ?',
      [name, gender, color, age || null, breed || null, address || null, status || 'Active', image_url || null, id]
    );

    res.json({ message: 'Dog record updated successfully.' });
  } catch (error) {
    console.error('Update dog error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Delete a dog record (protected)
exports.deleteDog = async (req, res) => {
  const { id } = req.params;

  try {
    const [dogs] = await db.query('SELECT id FROM dogs WHERE id = ?', [id]);
    if (dogs.length === 0) {
      return res.status(404).json({ message: 'Dog not found.' });
    }

    await db.query('DELETE FROM dogs WHERE id = ?', [id]);
    res.json({ message: 'Dog record deleted successfully.' });
  } catch (error) {
    console.error('Delete dog error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

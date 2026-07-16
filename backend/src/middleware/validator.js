const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim() === '') {
    errors.push('Username is required.');
  } else {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      errors.push('Username must be between 3 and 20 characters.');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      errors.push('Username can only contain alphanumeric characters and underscores.');
    }
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email is required.');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  // Clean data
  req.body.username = username.trim();
  req.body.email = email.trim();
  next();
};

exports.validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim() === '') {
    errors.push('Username is required.');
  }
  if (!password || typeof password !== 'string' || password === '') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  next();
};

exports.validateDog = (req, res, next) => {
  const { name, gender, age, breed, color, address, status, image_url } = req.body;
  const errors = [];

  // Required field: name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Dog name is required.');
  } else if (name.trim().length > 100) {
    errors.push('Dog name cannot exceed 100 characters.');
  }

  // Required field: gender
  if (!gender || (gender !== 'Male' && gender !== 'Female')) {
    errors.push("Gender is required and must be either 'Male' or 'Female'.");
  }

  // Optional field: age
  if (age !== undefined && age !== null && age !== '') {
    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 0) {
      errors.push('Age must be a non-negative integer.');
    }
  }

  // Optional field: breed
  if (breed && typeof breed === 'string' && breed.trim().length > 100) {
    errors.push('Breed name cannot exceed 100 characters.');
  }

  // Optional field: color
  if (color && typeof color === 'string' && color.trim().length > 50) {
    errors.push('Color description cannot exceed 50 characters.');
  }

  // Optional field: status
  if (status && !['Active', 'Adopted', 'Missing'].includes(status)) {
    errors.push("Status must be 'Active', 'Adopted', or 'Missing'.");
  }

  // Optional field: image_url
  if (image_url && typeof image_url === 'string' && image_url.trim() !== '') {
    if (image_url.trim().length > 255) {
      errors.push('Image URL cannot exceed 255 characters.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  // Sanitize values
  if (name) req.body.name = name.trim();
  if (breed) req.body.breed = breed.trim();
  if (color) req.body.color = color.trim();
  if (address) req.body.address = address.trim();
  if (image_url) req.body.image_url = image_url.trim();

  next();
};

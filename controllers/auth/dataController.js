const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// HARDCODED SECRET for all JWT ops:
const JWT_SECRET = 'secret'; // <<--- CHANGE BEFORE PRODUCTION!

// Helper: Always extract ONLY the JWT (whether or not it's prefixed with 'Bearer ')
function extractBearerToken(authHeaderOrToken) {
  if (!authHeaderOrToken) return null;
  return authHeaderOrToken.startsWith('Bearer ') ? authHeaderOrToken.slice(7) : authHeaderOrToken;
}

// 🔐 Middleware: API Auth (Header OR Query)
exports.auth = async (req, res, next) => {
  try {
    let token =
      extractBearerToken(req.header('Authorization')) ||
      extractBearerToken(req.query.token);

    if (!token) return res.status(401).send('Token missing');

    // Use HARDCODED secret for verification
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).send('User not found');

    req.user = user;
    res.locals.data = { token, user };
    next();
  } catch (err) {
    res.status(401).send('Not authorized');
  }
};

// ✅ Create New User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    // Issue token with hardcoded secret (1h expiry)
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    // Issue token with hardcoded secret (1h expiry)
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.locals.data = { user, token };
    return next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update User
exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    updates.forEach(key => user[key] = req.body[key]);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete User
exports.deleteUser = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get Profile (Optional Route)
exports.getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
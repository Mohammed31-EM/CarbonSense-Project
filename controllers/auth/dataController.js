const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret'; // For testing ONLY—replace in production!

// Helper to get bare JWT token from header or query
function extractBearerToken(authHeaderOrToken) {
  console.log('auth header token', authHeaderOrToken)
  if (!authHeaderOrToken) return null;
  return authHeaderOrToken.startsWith('Bearer ') ? authHeaderOrToken.slice(7) : authHeaderOrToken;
}

// Middleware: Authenticate via JWT
exports.auth = async (req, res, next) => {
  console.log('request', req.body)
  try {
    let token =
      extractBearerToken(req.header('Authorization')) ||
      extractBearerToken(req.query.token);
      console.log('token', token)

    if (!token) return res.status(401).json({error: 'Token missing'});

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) return res.status(401).json({error: 'User not found'});

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

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    const msg = (err && err.message) ? JSON.stringify(err.message).toLowerCase() : '';
    if (msg.includes('e11000') || msg.includes('duplicate key')) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(400).json({ message: 'Unknown error' });
  }
};



// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove password before sending user object
    const userObj = user.toObject();
    delete userObj.password;

    res.locals.data = { user: userObj, token };
    return next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    updates.forEach(key => user[key] = req.body[key]);
    await user.save();

    // Remove password before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const { password, ...userData } = req.user.toObject();
    res.json({ user: userData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

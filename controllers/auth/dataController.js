const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dataController = {};

// ✅ Middleware to authenticate user using query token or header
dataController.auth = async (req, res, next) => {
  try {
    let token = req.query.token || (req.header('Authorization')?.replace('Bearer ', ''));
    if (!token) return res.status(401).send('Not authorized');

    const data = jwt.verify(token, 'secret');
    const user = await User.findById(data._id);

    if (!user) return res.status(401).send('Not authorized');

    req.user = user;
    res.locals.data.token = token;
    next();
  } catch (error) {
    res.status(401).send('Not authorized');
  }
};

// ✅ Create user
dataController.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.locals.data.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Login user
dataController.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send('Invalid login credentials');
    }
    const token = await user.generateAuthToken();
    res.locals.data.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update user
dataController.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete user
dataController.deleteUser = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;

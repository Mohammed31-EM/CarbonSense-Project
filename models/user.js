const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'engineer'], 
    default: 'engineer' 
  }
}, { timestamps: true });

// ✅ Hide password from JSON responses
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

// ✅ Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

// ✅ Generate JWT with 1-hour expiration and role
userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign(
    { _id: this._id.toString(), role: this.role },
    'secret',
    { expiresIn: '1h' }   // Session alive for 1 hour
  );
  return token;
}

const User = mongoose.model('User', userSchema)

module.exports = User

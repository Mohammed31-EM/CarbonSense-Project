const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  emissions: { type: Number, required: true },
  status: { type: String, default: 'Active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // 👈 Add this line
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
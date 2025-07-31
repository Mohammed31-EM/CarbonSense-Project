const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  operationalSince: { type: Date },
  capacity: { type: Number }, // e.g., tons/day or MW
  status: { 
    type: String, 
    enum: ['Active', 'Under Maintenance', 'Inactive'], 
    default: 'Active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);

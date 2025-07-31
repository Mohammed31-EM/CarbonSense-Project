const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  equipmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment', 
    required: true 
  },
  parameter: { 
    type: String, 
    enum: ['energy', 'emissions', 'water', 'waste'], 
    required: true 
  },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reading', readingSchema);

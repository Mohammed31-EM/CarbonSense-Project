const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  plantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plant', 
    required: false 
  },
  equipmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment', 
    required: true 
  },
  parameter: { 
    type: String, 
    enum: ['energy', 'emissions', 'water', 'waste', 'temperature'], 
    required: true 
  },
  value: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Normal', 'Warning', 'Critical'], 
    default: 'Normal' 
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reading', readingSchema);

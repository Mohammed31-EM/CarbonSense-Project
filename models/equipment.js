const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  plantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plant', 
    required: true 
  },
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Pump, Generator
  energyRating: { type: Number }, // kWh
  status: { 
    type: String, 
    enum: ['Operational', 'Idle', 'Faulty'], 
    default: 'Operational' 
  },
  lastMaintenance: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);

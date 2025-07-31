const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  plantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plant', 
    required: true 
  },
  generatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  metrics: {
    totalEmissions: { type: Number, default: 0 },
    totalEnergy: { type: Number, default: 0 },
    waterUsage: { type: Number, default: 0 },
    waste: { type: Number, default: 0 },
    carbonFootprint: { type: Number, default: 0 }
  },
  filePath: { type: String } // optional: PDF or CSV file location
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

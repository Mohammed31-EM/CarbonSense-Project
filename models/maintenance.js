const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true },
  equipmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment', 
    required: true 
  },
  plantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plant', 
    required: false 
  },
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  date: { type: Date, default: Date.now },
  tasksPerformed: [{ type: String }],
  notes: { type: String },
  nextScheduledDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Scheduled'], 
    default: 'Pending' 
  }
}, { timestamps: true });


module.exports = mongoose.model('Maintenance', maintenanceSchema);
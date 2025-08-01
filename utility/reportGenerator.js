const Plant = require('../models/plant');
const Reading = require('../models/reading');
const Equipment = require('../models/equipment');
const fs = require('fs');
const path = require('path');

/**
 * Generate a sustainability report for a plant
 * @param {String} plantId - Plant ID
 * @param {Date} periodStart - Start date for the report
 * @param {Date} periodEnd - End date for the report
 * @returns {Object} - Report data object
 */
async function generateReport(plantId, periodStart, periodEnd) {
  // 1️⃣ Fetch plant info
  const plant = await Plant.findById(plantId);
  if (!plant) throw new Error('Plant not found');

  // 2️⃣ Get readings for this plant
  const equipment = await Equipment.find({ plantId }).select('_id');
  const equipmentIds = equipment.map(eq => eq._id);

  const readings = await Reading.find({
    equipmentId: { $in: equipmentIds },
    timestamp: { $gte: new Date(periodStart), $lte: new Date(periodEnd) }
  });

  // 3️⃣ Aggregate metrics
  const metrics = {
    totalEmissions: readings
      .filter(r => r.parameter === 'emissions')
      .reduce((sum, r) => sum + r.value, 0),
    totalEnergy: readings
      .filter(r => r.parameter === 'energy')
      .reduce((sum, r) => sum + r.value, 0),
    waterUsage: readings
      .filter(r => r.parameter === 'water')
      .reduce((sum, r) => sum + r.value, 0),
    waste: readings
      .filter(r => r.parameter === 'waste')
      .reduce((sum, r) => sum + r.value, 0),
  };

  // Calculate carbon footprint (basic example formula)
  metrics.carbonFootprint = metrics.totalEmissions * 5;

  // 4️⃣ Optionally generate a text file for the report
  const reportContent = `
    Sustainability Report - ${plant.name}
    Period: ${new Date(periodStart).toDateString()} to ${new Date(periodEnd).toDateString()}
    Location: ${plant.location}

    Total Emissions: ${metrics.totalEmissions} tons CO₂
    Total Energy: ${metrics.totalEnergy} kWh
    Water Usage: ${metrics.waterUsage} L
    Waste Generated: ${metrics.waste} kg
    Carbon Footprint: ${metrics.carbonFootprint} CO₂-e
  `;

  const filePath = path.join(__dirname, `../reports/report_${plantId}_${Date.now()}.txt`);
  fs.writeFileSync(filePath, reportContent);

  return { plantId, metrics, filePath };
}

module.exports = { generateReport };

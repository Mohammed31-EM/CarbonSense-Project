const Plant = require('../models/plant');
const Reading = require('../models/reading');
const Equipment = require('../models/equipment');
const fs = require('fs');
const path = require('path');

/**
 * Generate sustainability metrics for a plant within a given period.
 * @param {String} plantId - The plant's ObjectId.
 * @param {Date} periodStart - Start date for the report.
 * @param {Date} periodEnd - End date for the report.
 * @returns {Object} - Metrics data object.
 */
async function reportGenerator(plantId, periodStart, periodEnd) {
  // Validate plant
  const plant = await Plant.findById(plantId);
  if (!plant) throw new Error('Plant not found');
 
  // Validate dates
  const startDate = new Date(periodStart);
  const endDate = new Date(periodEnd);
  if (isNaN(startDate) || isNaN(endDate)) throw new Error('Invalid date range');
  endDate.setHours(23,59,59,999)
  

  // Fetch equipment IDs for this plant
  const equipment = await Equipment.find({ plantId }).select('_id');
  const equipmentIds = equipment.map(eq => eq._id);
 
  // Fetch readings for this plant's equipment within the time period
  const readings = await Reading.find({
    equipmentId: { $in: equipmentIds },
    timestamp: { $gte: startDate, $lte: endDate }
  });


  // Aggregate readings
  const metrics = {
    totalEmissions: readings.filter(r => r.parameter === 'emissions').reduce((sum, r) => sum + r.value, 0),
    totalEnergy: readings.filter(r => r.parameter === 'energy').reduce((sum, r) => sum + r.value, 0),
    waterUsage: readings.filter(r => r.parameter === 'water').reduce((sum, r) => sum + r.value, 0),
    waste: readings.filter(r => r.parameter === 'waste').reduce((sum, r) => sum + r.value, 0),
  };

  // Calculate carbon footprint (basic formula)
  metrics.carbonFootprint = metrics.totalEmissions * 5;

  // Ensure reports directory exists
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Generate a text file report (async)
  const reportContent = `
    Sustainability Report - ${plant.name}
    Period: ${startDate.toDateString()} to ${endDate.toDateString()}
    Location: ${plant.location}

    Total Emissions: ${metrics.totalEmissions} tons CO₂
    Total Energy: ${metrics.totalEnergy} kWh
    Water Usage: ${metrics.waterUsage} L
    Waste Generated: ${metrics.waste} kg
    Carbon Footprint: ${metrics.carbonFootprint} CO₂-e
  `;
  

  const filePath = path.join(reportsDir, `report_${plantId}_${Date.now()}.txt`);
  try {
    await fs.promises.writeFile(filePath, reportContent);
  } catch (err) {
    throw new Error('Failed to write report file: ' + err.message);
  }
  const filename = path.basename(filePath)
  return { ...metrics, filename};
}

module.exports = reportGenerator;

// --- SAMPLE EXPRESS ROUTE FOR REPORT GENERATION ---
// Add this to your routes/apiRoutes.js or similar file:
/*
const express = require('express');
const router = express.Router();
const reportGenerator = require('../utility/reportGenerator');

// POST /api/reports/generate
router.post('/api/reports/generate', async (req, res) => {
  try {
    const { plantId, periodStart, periodEnd } = req.body;
    const report = await reportGenerator(plantId, periodStart, periodEnd);
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
*/

// --- SAMPLE FRONTEND FETCH FUNCTION ---
// Use this in your React/JSX view to call the backend route:
/*
async function generateReport(plantId, periodStart, periodEnd) {
  const response = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plantId, periodStart, periodEnd })
  });
  const data = await response.json();
  // Handle data (show metrics, link to file, etc.)
}
*/

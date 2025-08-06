const Plant = require('../models/plant');
const Reading = require('../models/reading');
const Equipment = require('../models/equipment');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Generate sustainability metrics for a plant within a given period.
 * @param {String} plantId - The plant's ObjectId.
 * @param {Date} periodStart - Start date for the report.
 * @param {Date} periodEnd - End date for the report.
 * @returns {Object} - Metrics data object.
 */
async function reportGenerator(plantId, periodStart, periodEnd) {
  const plant = await Plant.findById(plantId);
  if (!plant) throw new Error('Plant not found');
 
  const startDate = new Date(periodStart);
  const endDate = new Date(periodEnd);
  if (isNaN(startDate) || isNaN(endDate)) throw new Error('Invalid date range');
  endDate.setHours(23,59,59,999)
  
  const equipment = await Equipment.find({ plantId }).select('_id');
  const equipmentIds = equipment.map(eq => eq._id);
 
  const readings = await Reading.find({
    equipmentId: { $in: equipmentIds },
    timestamp: { $gte: startDate, $lte: endDate }

  });

  const metrics = {
    totalEmissions: readings.filter(r => r.parameter === 'emissions').reduce((sum, r) => sum + r.value, 0),
    totalEnergy: readings.filter(r => r.parameter === 'energy').reduce((sum, r) => sum + r.value, 0),
    waterUsage: readings.filter(r => r.parameter === 'water').reduce((sum, r) => sum + r.value, 0),
    waste: readings.filter(r => r.parameter === 'waste').reduce((sum, r) => sum + r.value, 0),
  };

  metrics.carbonFootprint = metrics.totalEmissions * 5;

  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

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
  
  const pdfFilePath = path.join(reportsDir, `report_${plantId}_${Date.now()}.pdf`)
  const doc = new PDFDocument();

  const pdfStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(pdfStream);

doc.fontSize(18).text(`Sustainability Report - ${plant.name}`, { underline: true });
doc.moveDown();
doc.fontSize(12).text(`Period: ${startDate.toDateString()} to ${endDate.toDateString()}`);
doc.text(`Location: ${plant.location}`);
doc.moveDown();
doc.text(`Total Emissions: ${metrics.totalEmissions} tons CO₂`);
doc.text(`Total Energy: ${metrics.totalEnergy} kWh`);
doc.text(`Water Usage: ${metrics.waterUsage} L`);
doc.text(`Waste Generated: ${metrics.waste} kg`);
doc.text(`Carbon Footprint: ${metrics.carbonFootprint} CO₂-e`);

doc.end();

await new Promise((resolve, reject) => {
  pdfStream.on('finish', resolve);
  pdfStream.on('error', reject);
});

  const filePath = path.join(reportsDir, `report_${plantId}_${Date.now()}.txt`);
  try {
    await fs.promises.writeFile(filePath, reportContent);
  } catch (err) {
    throw new Error('Failed to write report file: ' + err.message);
  }
  const filename = path.basename(filePath)
  return { ...metrics,txtFilename: filename, pdfFilename: path.basename(pdfFilePath)};
}

module.exports = reportGenerator;



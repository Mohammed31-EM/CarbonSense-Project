const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ report, token }) {
  return (
    <Layout title="Report Details" token={token}>
      <div className="container">
        <h1>📄 Report for Plant: {report.plantId?.name || 'N/A'}</h1>
        <p><strong>Period:</strong> {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}</p>
        <p><strong>Total Emissions:</strong> {report.metrics.totalEmissions} tons</p>
        <p><strong>Total Energy:</strong> {report.metrics.totalEnergy} kWh</p>
        <p><strong>Water Usage:</strong> {report.metrics.waterUsage} m³</p>
        <p><strong>Waste:</strong> {report.metrics.waste} kg</p>
        <p><strong>Carbon Footprint:</strong> {report.metrics.carbonFootprint} CO₂eq</p>
        {report.filePath && (
          <p><a href={report.filePath} target="_blank">📂 Download Report File</a></p>
        )}

        <a href={`/reports?token=${token}`} className="btn">⬅ Back</a>
        <a href={`/reports/${report._id}/edit?token=${token}`} className="btn">✏ Edit</a>
      </div>
    </Layout>
  );
}

module.exports = Show;

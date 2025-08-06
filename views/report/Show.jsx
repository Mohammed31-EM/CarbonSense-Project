const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ report, token }) {
  // Defensive: If report not found
  const filename = report.filePath ? report.filePath.split(/[\\/]/).pop(): '';
  if (!report) {
    return (
      <Layout title="Report Not Found" token={token}>
        <div className="container">
          <h1>❌ Report Not Found</h1>
          <a href={`/reports?token=${token}`} className="btn">⬅ Back</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Report Details" token={token}>
      <div className="container">
        <h1>📄 Report for Plant: {report.plantId?.name || report.plantName || 'N/A'}</h1>
        <p><strong>Period:</strong> {report.periodStart ? new Date(report.periodStart).toLocaleDateString() : '—'} - {report.periodEnd ? new Date(report.periodEnd).toLocaleDateString() : '—'}</p>
        <p><strong>Total Emissions:</strong> {report.metrics?.totalEmissions ?? 0} tons</p>
        <p><strong>Total Energy:</strong> {report.metrics?.totalEnergy ?? 0} kWh</p>
        <p><strong>Water Usage:</strong> {report.metrics?.waterUsage ?? 0} m³</p>
        <p><strong>Waste:</strong> {report.metrics?.waste ?? 0} kg</p>
        <p><strong>Carbon Footprint:</strong> {report.metrics?.carbonFootprint ?? 0} CO₂eq</p>
        {report.filename && (
          <p>
            <a href={`/reports/download?file=${encodeURIComponent(report.filename)}`} className="btn btn-primary" download>
              📂 Download Report
            </a>
          </p>
        )}

        <a href={`/reports?token=${token}`} className="btn">⬅ Back</a>
        <a href={`/reports/${report._id}/edit?token=${token}`} className="btn">✏ Edit</a>
      </div>
    </Layout>
  );
}

module.exports = Show;

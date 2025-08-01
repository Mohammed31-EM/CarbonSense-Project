const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ report, plants, token }) {
  return (
    <Layout title="Edit Report" token={token}>
      <div className="container">
        <h1>✏ Edit Report for Plant: {report.plantId?.name || 'N/A'}</h1>
        <form action={`/reports/${report._id}?_method=PUT&token=${token}`} method="POST">
          <label>Plant:</label>
          <select name="plantId" defaultValue={report.plantId?._id}>
            {plants.map((plant) => (
              <option key={plant._id} value={plant._id}>{plant.name}</option>
            ))}
          </select><br/>

          <label>Period Start:</label>
          <input type="date" name="periodStart" defaultValue={report.periodStart.split('T')[0]} /><br/>

          <label>Period End:</label>
          <input type="date" name="periodEnd" defaultValue={report.periodEnd.split('T')[0]} /><br/>

          <label>Total Emissions (tons):</label>
          <input type="number" name="metrics.totalEmissions" step="0.01" defaultValue={report.metrics.totalEmissions} /><br/>

          <label>Total Energy (kWh):</label>
          <input type="number" name="metrics.totalEnergy" step="0.01" defaultValue={report.metrics.totalEnergy} /><br/>

          <label>Water Usage (m³):</label>
          <input type="number" name="metrics.waterUsage" step="0.01" defaultValue={report.metrics.waterUsage} /><br/>

          <label>Waste (kg):</label>
          <input type="number" name="metrics.waste" step="0.01" defaultValue={report.metrics.waste} /><br/>

          <label>Carbon Footprint (CO₂eq):</label>
          <input type="number" name="metrics.carbonFootprint" step="0.01" defaultValue={report.metrics.carbonFootprint} /><br/>

          <button type="submit" className="btn">Update Report</button>
        </form>
        <a href={`/reports?token=${token}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = Edit;

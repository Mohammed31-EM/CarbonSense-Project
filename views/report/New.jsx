const React = require('react');
const Layout = require('../layouts/Layout');

function New({ plants, token }) {
  return (
    <Layout title="Generate New Report" token={token}>
      <div className="container">
        <h1>➕ Generate Sustainability Report</h1>
        <form action={`/reports?token=${token}`} method="POST">
          <label>Plant:</label>
          <select name="plantId" required>
            {plants.map((plant) => (
              <option key={plant._id} value={plant._id}>{plant.name}</option>
            ))}
          </select><br/>

          <label>Period Start:</label>
          <input type="date" name="periodStart" required /><br/>

          <label>Period End:</label>
          <input type="date" name="periodEnd" required /><br/>

          <label>Total Emissions (tons):</label>
          <input type="number" name="metrics.totalEmissions" step="0.01" /><br/>

          <label>Total Energy (kWh):</label>
          <input type="number" name="metrics.totalEnergy" step="0.01" /><br/>

          <label>Water Usage (m³):</label>
          <input type="number" name="metrics.waterUsage" step="0.01" /><br/>

          <label>Waste (kg):</label>
          <input type="number" name="metrics.waste" step="0.01" /><br/>

          <label>Carbon Footprint (CO₂eq):</label>
          <input type="number" name="metrics.carbonFootprint" step="0.01" /><br/>

          <button type="submit" className="btn">Generate Report</button>
        </form>
        <a href={`/reports?token=${token}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = New;

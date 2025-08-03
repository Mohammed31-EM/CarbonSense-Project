const React = require('react');
const Layout = require('../layouts/Layout');

function New({ plants = [], token }) {
  const [result, setResult] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const plantId = form.plantId.value;
    const periodStart = form.periodStart.value;
    const periodEnd = form.periodEnd.value;
    setResult('Generating...');
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantId, periodStart, periodEnd })
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setResult(data.error || 'Error generating report');
      }
    } catch (err) {
      setResult('Error: ' + err.message);
    }
  };

  // 🚨 Show message if no plants exist
  if (!plants.length) {
    return (
      <Layout title="Generate New Report" token={token}>
        <div className="container">
          <h2>No plants found in the system. Please add a plant first.</h2>
          <a href={`/plants/new?token=${token}`} className="btn">Add Plant</a>
          <a href={`/reports?token=${token}`} className="btn">Back to Reports</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Generate New Report" token={token}>
      <div className="container">
        <h1>➕ Generate Sustainability Report</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn">Generate Report</button>
        </form>
        <a href={`/reports?token=${token}`} className="btn">Cancel</a>
        {result && (
          <div className="report-result" style={{ marginTop: '2em' }}>
            {typeof result === 'string' ? (
              <p>{result}</p>
            ) : (
              <div>
                <h3>Report Generated!</h3>
                <ul>
                  <li>Total Emissions: {result.totalEmissions} tons CO₂</li>
                  <li>Total Energy: {result.totalEnergy} kWh</li>
                  <li>Water Usage: {result.waterUsage} L</li>
                  <li>Waste: {result.waste} kg</li>
                  <li>Carbon Footprint: {result.carbonFootprint} CO₂-e</li>
                  {result.filePath &&
                    <li>File: <a href={result.filePath} target="_blank" rel="noopener noreferrer">Download Report</a></li>
                  }
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

module.exports = New;

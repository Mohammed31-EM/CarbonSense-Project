const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ reports = [], token = '' }) {
  return (
    <Layout title="All Reports" token={token}>
      <div className="container">
        <h1>📑 Sustainability Reports</h1>
        <a href={`/reports/new?token=${token}`} className="btn">➕ Generate New Report</a>

        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Plant</th>
                <th>Period Start</th>
                <th>Period End</th>
                <th>Total Emissions</th>
                <th>Carbon Footprint</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.plantId?.name || report.plantName || 'N/A'}</td>
                  <td>{report.periodStart ? new Date(report.periodStart).toLocaleDateString() : '—'}</td>
                  <td>{report.periodEnd ? new Date(report.periodEnd).toLocaleDateString() : '—'}</td>
                  <td>{report.metrics?.totalEmissions ?? 0} tons</td>
                  <td>{report.metrics?.carbonFootprint ?? 0} CO₂eq</td>
                  <td>
                    <a href={`/reports/${report._id}?token=${token}`} className="btn">View</a>
                    <a href={`/reports/${report._id}/edit?token=${token}`} className="btn">Edit</a>
                    <form
                      action={`/reports/${report._id}?_method=DELETE&token=${token}`}
                      method="POST"
                      style={{ display: 'inline' }}
                    >
                      <button type="submit" className="btn danger">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

module.exports = Index;

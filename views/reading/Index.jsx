const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ readings, token }) {
  return (
    <Layout title="All Readings" token={token}>
      <div className="container">
        <h1>📊 All Readings</h1>
        <a href={`/readings/new?token=${token}`} className="btn">➕ Add New Reading</a>
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Parameter</th>
              <th>Value</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading._id}>
                <td>{reading.equipmentId?.name || 'N/A'}</td>
                <td>{reading.parameter}</td>
                <td>{reading.value}</td>
                <td>{new Date(reading.timestamp).toLocaleString()}</td>
                <td>
                  <a href={`/readings/${reading._id}?token=${token}`} className="btn">View</a>
                  <a href={`/readings/${reading._id}/edit?token=${token}`} className="btn">Edit</a>
                  <form action={`/readings/${reading._id}?_method=DELETE&token=${token}`} method="POST" style={{ display: 'inline' }}>
                    <button type="submit" className="btn danger">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

module.exports = Index;

const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ reading, token }) {
  return (
    <Layout title="Reading Details" token={token}>
      <div className="container">
        <h1>📊 Reading Details</h1>
        <p><strong>Equipment:</strong> {reading.equipmentId?.name || 'N/A'}</p>
        <p><strong>Parameter:</strong> {reading.parameter}</p>
        <p><strong>Value:</strong> {reading.value}</p>
        <p><strong>Timestamp:</strong> {new Date(reading.timestamp).toLocaleString()}</p>

        <a href={`/readings?token=${token}`} className="btn">⬅ Back</a>
        <a href={`/readings/${reading._id}/edit?token=${token}`} className="btn">✏ Edit</a>
      </div>
    </Layout>
  );
}

module.exports = Show;

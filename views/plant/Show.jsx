const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ plant, token = '' }) {
  return (
    <Layout title="Plant Details" token={token}>
      <div className="container">
        <h1>🌱 Plant: {plant.name}</h1>
        <p><strong>Location:</strong> {plant.location}</p>
        <p><strong>Emissions:</strong> {plant.emissions} tons CO₂</p>
        <p><strong>Status:</strong> {plant.status}</p>

        <a href={`/plants?token=${encodeURIComponent(token)}`} className="btn">⬅ Back</a>
        <a href={`/plants/${plant._id}/edit?token=${encodeURIComponent(token)}`} className="btn">✏ Edit</a>
      </div>
    </Layout>
  );
}

module.exports = Show;

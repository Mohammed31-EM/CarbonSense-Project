const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ plant, token }) {
  return (
    <Layout title="Plant Details">
      <h1>{plant.name}</h1>
      <p><strong>Location:</strong> {plant.location}</p>
      <p><strong>Emission Level:</strong> {plant.emissions} tons/year</p>

      <a href={`/plants/${plant._id}/edit?token=${token}`}><button>Edit</button></a>

      <form action={`/plants/${plant._id}?_method=DELETE&token=${token}`} method="POST" style={{ marginTop: '10px' }}>
        <button type="submit">Delete</button>
      </form>

      <br/>
      <a href={`/plants?token=${token}`}>⬅ Back to Plants</a>
    </Layout>
  );
}

module.exports = Show;

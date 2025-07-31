const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ plant }) {
  return (
    <Layout title="Edit Plant">
      <h1>✏️ Edit Plant</h1>
      <form action={`/plants/${plant._id}?_method=PUT`} method="POST">
        <label>Name:</label>
        <input type="text" name="name" defaultValue={plant.name} required />
        <label>Location:</label>
        <input type="text" name="location" defaultValue={plant.location} required />
        <label>Operational Since:</label>
        <input type="date" name="operationalSince" defaultValue={plant.operationalSince?.toISOString().split('T')[0]} />
        <label>Capacity (tons/day):</label>
        <input type="number" name="capacity" defaultValue={plant.capacity} />
        <button type="submit">Update Plant</button>
      </form>
    </Layout>
  );
}

module.exports = Edit;

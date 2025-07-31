const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ plant, token }) {
  return (
    <Layout title="Edit Plant">
      <h1>Edit Plant</h1>
      <form action={`/plants/${plant._id}?_method=PUT&token=${token}`} method="POST">
        <label>Plant Name:</label>
        <input type="text" name="name" defaultValue={plant.name} required /><br/>

        <label>Location:</label>
        <input type="text" name="location" defaultValue={plant.location} required /><br/>

        <label>Emission Level (tons/year):</label>
        <input type="number" name="emissions" defaultValue={plant.emissions} required /><br/>

        <input type="submit" value="Update Plant" />
      </form>
    </Layout>
  );
}

module.exports = Edit;

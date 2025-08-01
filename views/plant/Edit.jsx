const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ plant, token = '' }) {
  return (
    <Layout title="Edit Plant" token={token}>
      <div className="container">
        <h1>✏ Edit Plant: {plant.name}</h1>
        <form 
          action={`/plants/${plant._id}?_method=PUT&token=${encodeURIComponent(token)}`} 
          method="POST"
        >
          <label>Name:</label>
          <input type="text" name="name" defaultValue={plant.name} required /><br/>

          <label>Location:</label>
          <input type="text" name="location" defaultValue={plant.location} required /><br/>

          <label>Emissions (tons CO₂):</label>
          <input type="number" name="emissions" defaultValue={plant.emissions} required /><br/>

          <label>Status:</label>
          <select name="status" defaultValue={plant.status}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select><br/>

          <button type="submit" className="btn">Update Plant</button>
        </form>
        <a href={`/plants?token=${encodeURIComponent(token)}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = Edit;

const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token }) {
  return (
    <Layout title="Add New Plant">
      <div className="container">
        <h1>➕ Add a New Plant</h1>
        <form action={`/plants?token=${token}`} method="POST">
          <label>Name:</label>
          <input type="text" name="name" required /><br/>

          <label>Location:</label>
          <input type="text" name="location" required /><br/>

          <label>Emissions (tons CO₂):</label>
          <input type="number" name="emissions" required /><br/>

          <label>Status:</label>
          <select name="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select><br/>

          <button type="submit" className="btn">Create Plant</button>
        </form>
        <a href={`/plants?token=${token}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = New;

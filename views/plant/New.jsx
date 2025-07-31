const React = require('react');
const Layout = require('../layouts/Layout');

function New() {
  return (
    <Layout title="Add New Plant">
      <h1>➕ Add a New Plant</h1>
      <form action="/plants" method="POST">
        <label>Name:</label>
        <input type="text" name="name" required />
        <label>Location:</label>
        <input type="text" name="location" required />
        <label>Operational Since:</label>
        <input type="date" name="operationalSince" />
        <label>Capacity (tons/day):</label>
        <input type="number" name="capacity" />
        <button type="submit">Add Plant</button>
      </form>
    </Layout>
  );
}

module.exports = New;

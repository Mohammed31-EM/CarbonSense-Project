const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token }) {
  return (
    <Layout title="Add New Plant">
      <h1>Add New Plant</h1>
      <form action={`/plants?token=${token}`} method="POST">
        <label>Plant Name:</label>
        <input type="text" name="name" required /><br/>

        <label>Location:</label>
        <input type="text" name="location" required /><br/>

        <label>Emission Level (tons/year):</label>
        <input type="number" name="emissions" required /><br/>

        <input type="submit" value="Add Plant" />
      </form>
    </Layout>
  );
}

module.exports = New;

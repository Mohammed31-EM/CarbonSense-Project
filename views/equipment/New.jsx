const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token }) {
  return (
    <Layout title="Add New Equipment">
      <div className="container">
        <h1>Add New Equipment</h1>
        <form action={`/equipment?token=${token}`} method="POST">
          <label>Name:</label>
          <input type="text" name="name" required /><br />

          <label>Type:</label>
          <input type="text" name="type" required /><br />

          <label>Status:</label>
          <select name="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select><br />

          <label>Linked Plant ID:</label>
          <input type="text" name="plant" placeholder="Enter Plant ID" required /><br />

          <button type="submit">Add Equipment</button>
        </form>
        <a href={`/equipment?token=${token}`}><button>Back to Equipment List</button></a>
      </div>
    </Layout>
  );
}

module.exports = New;

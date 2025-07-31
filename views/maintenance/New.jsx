const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token }) {
  return (
    <Layout title="Add Maintenance Record">
      <h1>Add Maintenance Record</h1>
      <form action={`/maintenance?token=${token}`} method="POST">
        <label>Title:</label>
        <input type="text" name="title" required /><br/>

        <label>Description:</label>
        <textarea name="description" required></textarea><br/>

        <label>Date:</label>
        <input type="date" name="date" required /><br/>

        <label>Status:</label>
        <select name="status">
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select><br/>

        <input type="submit" value="Add Record" />
      </form>
    </Layout>
  );
}

module.exports = New;

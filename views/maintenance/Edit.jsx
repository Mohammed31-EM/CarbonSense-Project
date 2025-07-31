const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ maintenance, token }) {
  return (
    <Layout title="Edit Maintenance Record">
      <h1>Edit Maintenance Record</h1>
      <form action={`/maintenance/${maintenance._id}?_method=PUT&token=${token}`} method="POST">
        <label>Title:</label>
        <input type="text" name="title" defaultValue={maintenance.title} required /><br/>

        <label>Description:</label>
        <textarea name="description" defaultValue={maintenance.description} required></textarea><br/>

        <label>Date:</label>
        <input type="date" name="date" defaultValue={maintenance.date.split('T')[0]} required /><br/>

        <label>Status:</label>
        <select name="status" defaultValue={maintenance.status}>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select><br/>

        <input type="submit" value="Update Record" />
      </form>
    </Layout>
  );
}

module.exports = Edit;

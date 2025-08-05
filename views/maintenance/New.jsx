const React = require('react');
const Layout = require('../layouts/Layout');

function New({plants = [], equipment =[], token }) {
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

        <label>Plant:</label>
        <select name = "plantId" required>
          <option value = "">--Select Plant--</option>
          {plants.map(plant => (
            <option key={plant._id} value={plant._id}>{plant.name}</option>
          ))}
        </select><br/>

        <label>Equipment:</label>
        <select name = "equipmentId" required>
          <option value = "">--Select Equipment--</option>
          {equipment.map(eq => (
            <option key={eq._id} value={eq._id}>{eq.name}</option>
          ))}
        </select><br/>

        <input type="submit" value="Add Record" />
      </form>
    </Layout>
  );
}

module.exports = New;

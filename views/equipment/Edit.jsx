const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ equipment, plants =[], token }) {
  return (
    <Layout title="Edit Equipment">
      <div className="container">
        <h1>Edit Equipment</h1>
        <form action={`/equipment/${equipment._id}?_method=PUT&token=${token}`} method="POST">
          <label>Name:</label>
          <input type="text" name="name" defaultValue={equipment.name} required /><br />

          <label>Type:</label>
          <input type="text" name="type" defaultValue={equipment.type} required /><br />

          <label>Status:</label>
          <select name="status" defaultValue={equipment.status}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select><br />

          <label>Linked Plant:</label>
          <select name="plantId" defaultValue={equipment.plantId ? equipment.plantId.toString() : ''} required>
            <option value="">Select Plant</option>
            {plants.map((plant) => (
              <option key={plant._id} value={plant._id}
                selected={equipment.plantId && plant._id.toString() === equipment.plantId.toString()}>
                {plant.name}
              </option>
            ))}
          </select>
            <br />

          <button type="submit">Update Equipment</button>
        </form>
        <a href={`/equipment?token=${token}`}><button>Cancel</button></a>
      </div>
    </Layout>
  );
}

module.exports = Edit;

const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token, plants = [] }) {
  return (
    <Layout title="Add Equipment" token={token}>
      <div className="container">
        <h1>Add New Equipment</h1>
        <form action={`/equipment?token=${encodeURIComponent(token)}`} method="POST">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" required />

          <label htmlFor="type">Type:</label>
          <input type="text" name="type" id="type" required />

          <label htmlFor="energyRating">Energy Rating (kWh):</label>
          <input type="number" name="energyRating" id="energyRating" />

          <label htmlFor="status">Status:</label>
          <select name="status" id="status" required>
            <option value="Operational">Operational</option>
            <option value="Idle">Idle</option>
            <option value="Faulty">Faulty</option>
          </select>

          <label htmlFor="plantId">Plant:</label>
          <select name="plantId" id="plantId" required>
            {plants.map(plant => (
              <option value={plant._id} key={plant._id}>
                {plant.name} ({plant.location})
              </option>
            ))}
          </select>

          <button type="submit" className="btn">Add Equipment</button>
        </form>
        <a href={`/equipment?token=${encodeURIComponent(token)}`}>
          <button>Back to Equipment List</button>
        </a>
        <a href={`/plants?token=${encodeURIComponent(token)}`}>
          <button>Back to Plants</button>
        </a>
      </div>
    </Layout>
  );
}

module.exports = New;

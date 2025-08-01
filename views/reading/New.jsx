const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token, equipmentList }) {
  return (
    <Layout title="Add New Reading" token={token}>
      <div className="container">
        <h1>➕ Add a New Reading</h1>
        <form action={`/readings?token=${token}`} method="POST">
          <label>Equipment:</label>
          <select name="equipmentId" required>
            {equipmentList && equipmentList.length > 0 ? (
              equipmentList.map(eq => (
                <option value={eq._id} key={eq._id}>{eq.name}</option>
              ))
            ) : (
              <option disabled>No equipment available</option>
            )}
          </select><br/>

          <label>Parameter:</label>
          <select name="parameter" required>
            <option value="energy">Energy</option>
            <option value="emissions">Emissions</option>
            <option value="water">Water</option>
            <option value="waste">Waste</option>
          </select><br/>

          <label>Value:</label>
          <input type="number" step="0.01" name="value" required /><br/>

          <button type="submit" className="btn">Create Reading</button>
        </form>
        <a href={`/readings?token=${token}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = New;

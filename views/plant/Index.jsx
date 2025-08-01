const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ plants = [], token = '' }) {
  return (
    <Layout title="All Plants" token={token}>
      <div className="container">
        <h1>🌱 All Plants</h1>
        <a href={`/plants/new?token=${encodeURIComponent(token)}`} className="btn">➕ Add New Plant</a>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Emissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.length > 0 ? (
              plants.map((plant) => (
                <tr key={plant._id}>
                  <td>{plant.name}</td>
                  <td>{plant.location}</td>
                  <td>{plant.emissions}</td>
                  <td>{plant.status}</td>
                  <td>
                    <a href={`/plants/${plant._id}?token=${encodeURIComponent(token)}`} className="btn">View</a>
                    <a href={`/plants/${plant._id}/edit?token=${encodeURIComponent(token)}`} className="btn">Edit</a>
                    <form 
                      action={`/plants/${plant._id}?_method=DELETE&token=${encodeURIComponent(token)}`} 
                      method="POST" 
                      style={{ display: 'inline' }}
                    >
                      <button type="submit" className="btn danger">Delete</button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No plants available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

module.exports = Index;

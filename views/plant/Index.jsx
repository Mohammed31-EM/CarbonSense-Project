const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ plants, token }) {
  return (
    <Layout title="Plants">
      <h1>All Plants</h1>
      <a href={`/plants/new?token=${token}`}><button>Add New Plant</button></a>
      <ul>
        {plants.map((plant) => (
          <li key={plant._id}>
            <a href={`/plants/${plant._id}?token=${token}`}>
              {plant.name} - {plant.location}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

module.exports = Index;

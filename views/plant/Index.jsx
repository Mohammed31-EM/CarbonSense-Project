const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ plants }) {
  return (
    <Layout title="All Plants">
      <h1>🌱 Plant List</h1>
      <a href="/plants/new"><button>Add New Plant</button></a>
      <ul>
        {plants.map((plant) => (
          <li key={plant._id}>
            <a href={`/plants/${plant._id}`}>{plant.name}</a> - {plant.location}
            <form action={`/plants/${plant._id}?_method=DELETE`} method="POST" style={{display: 'inline'}}>
              <button type="submit">Delete</button>
            </form>
            <a href={`/plants/${plant._id}/edit`}><button>Edit</button></a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

module.exports = Index;

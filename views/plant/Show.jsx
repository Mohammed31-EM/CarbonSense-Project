const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ plant }) {
  return (
    <Layout title={plant.name}>
      <h1>{plant.name}</h1>
      <p><strong>Location:</strong> {plant.location}</p>
      <p><strong>Operational Since:</strong> {plant.operationalSince ? new Date(plant.operationalSince).toDateString() : 'N/A'}</p>
      <p><strong>Capacity:</strong> {plant.capacity || 'Not specified'} tons/day</p>

      <a href="/plants"><button>Back to List</button></a>
      <a href={`/plants/${plant._id}/edit`}><button>Edit</button></a>
      <form action={`/plants/${plant._id}?_method=DELETE`} method="POST" style={{display: 'inline'}}>
        <button type="submit">Delete</button>
      </form>
    </Layout>
  );
}

module.exports = Show;

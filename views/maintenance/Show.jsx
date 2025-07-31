const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ maintenance, token }) {
  return (
    <Layout title="Maintenance Details">
      <h1>{maintenance.title}</h1>
      <p><strong>Description:</strong> {maintenance.description}</p>
      <p><strong>Date:</strong> {new Date(maintenance.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {maintenance.status}</p>

      <a href={`/maintenance/${maintenance._id}/edit?token=${token}`}><button>Edit</button></a>

      <form action={`/maintenance/${maintenance._id}?_method=DELETE&token=${token}`} method="POST" style={{ marginTop: '10px' }}>
        <button type="submit">Delete</button>
      </form>

      <br/>
      <a href={`/maintenance?token=${token}`}>⬅ Back to Records</a>
    </Layout>
  );
}

module.exports = Show;

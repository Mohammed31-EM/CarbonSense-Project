const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ equipment, token }) {
  return (
    <Layout title="Equipment Details">
      <div className="container">
        <h1>{equipment.name}</h1>
        <p><strong>Type:</strong> {equipment.type}</p>
        <p><strong>Status:</strong> {equipment.status}</p>
        <p><strong>Linked Plant ID:</strong> {equipment.plant}</p>

        <a href={`/equipment/${equipment._id}/edit?token=${token}`}><button>Edit</button></a>

        <form action={`/equipment/${equipment._id}?_method=DELETE&token=${token}`} method="POST" style={{ marginTop: '10px' }}>
          <button type="submit">Delete</button>
        </form>

        <a href={`/equipment?token=${token}`}><button>Back to List</button></a>
      </div>
    </Layout>
  );
}

module.exports = Show;

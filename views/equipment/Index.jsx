const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ equipments, token }) {
  return (
    <Layout title="All Equipment">
      <div className="container">
        <h1>Equipment List</h1>
        <a href={`/equipment/new?token=${token}`}><button>Add New Equipment</button></a>
        <ul>
          {equipments && equipments.length > 0 ? (
            equipments.map(equipment => (
              <li key={equipment._id}>
                <a href={`/equipment/${equipment._id}?token=${token}`}>
                  {equipment.name} - {equipment.type} (Status: {equipment.status})
                </a>
              </li>
            ))
          ) : (
            <li>No equipment found</li>
          )}
        </ul>
      </div>
    </Layout>
  );
}

module.exports = Index;

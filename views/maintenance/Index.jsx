const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ maintenances }) {
  return (
    <Layout title="Maintenance Records">
      <h1>Maintenance Records</h1>
      <a href="/maintenance/new"><button>Add New Maintenance</button></a>
      <ul>
        {maintenances.map((record) => (
          <li key={record._id}>
            <a href={`/maintenance/${record._id}`}>
              {record.title} - {record.date}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

module.exports = Index;

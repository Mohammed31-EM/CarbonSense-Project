// views/maintenance/Index.jsx
const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ maintenances = [], token = '' }) {
  return (
    <Layout title="Maintenance Records" token={token}>
      <div className="container">
        <h1>🛠️ Maintenance Records</h1>
        <a href={`/maintenance/new?token=${token}`} className="btn">➕ Add New Maintenance</a>

        {maintenances.length === 0 ? (
          <p>No maintenance records found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Status</th>
                <th>Performed By</th>
                <th>Next Scheduled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenances.map((record) => (
                <tr key={record._id}>
                  <td>{record.equipmentId?.name || 'N/A'}</td>
                  <td>{record.status || 'N/A'}</td>
                  <td>{record.performedBy?.name || record.performedBy || 'N/A'}</td>
                  <td>
                    {record.nextScheduledDate
                      ? new Date(record.nextScheduledDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <a href={`/maintenance/${record._id}?token=${token}`} className="btn">View</a>
                    <a href={`/maintenance/${record._id}/edit?token=${token}`} className="btn">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* DEBUG: See raw data */}
        {/* <pre>{JSON.stringify(maintenances, null, 2)}</pre> */}
      </div>
    </Layout>
  );
}

module.exports = Index;

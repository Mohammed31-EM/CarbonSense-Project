const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ reports, token }) {
  return (
    <Layout title="All Reports" token={token}>
      <div className="container">
        <h1>📊 All Reports</h1>
        <a href={`/reports/new?token=${token}`} className="btn">➕ Add New Report</a>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Summary</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.title}</td>
                <td>{report.summary}</td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td>
                  <a href={`/reports/${report._id}?token=${token}`} className="btn">View</a>
                  <a href={`/reports/${report._id}/edit?token=${token}`} className="btn">Edit</a>
                  <form action={`/reports/${report._id}?_method=DELETE&token=${token}`} method="POST" style={{ display: 'inline' }}>
                    <button type="submit" className="btn danger">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

module.exports = Index;

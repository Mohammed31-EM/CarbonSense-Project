const React = require('react');
const Layout = require('../layouts/Layout');

function Show({ report, token }) {
  return (
    <Layout title="Report Details" token={token}>
      <div className="container">
        <h1>📑 Report: {report.title}</h1>
        <p><strong>Summary:</strong> {report.summary}</p>
        <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>

        <a href={`/reports?token=${token}`} className="btn">⬅ Back</a>
        <a href={`/reports/${report._id}/edit?token=${token}`} className="btn">✏ Edit</a>
      </div>
    </Layout>
  );
}

module.exports = Show;

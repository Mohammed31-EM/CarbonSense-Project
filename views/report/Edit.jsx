const React = require('react');
const Layout = require('../layouts/Layout');

function Edit({ report, token }) {
  return (
    <Layout title="Edit Report" token={token}>
      <div className="container">
        <h1>✏ Edit Report: {report.title}</h1>
        <form action={`/reports/${report._id}?_method=PUT&token=${token}`} method="POST">
          <label>Title:</label>
          <input type="text" name="title" defaultValue={report.title} required /><br/>

          <label>Summary:</label>
          <textarea name="summary" required>{report.summary}</textarea><br/>

          <button type="submit" className="btn">Update Report</button>
        </form>
        <a href={`/reports?token=${token}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = Edit;

const React = require('react');
const Layout = require('../layouts/Layout');

function New({ token }) {
  return (
    <Layout title="Add New Report" token={token}>
      <div className="container">
        <h1>➕ Add a New Report</h1>
        <form action={`/reports?token=${token}`} method="POST">
          <label>Title:</label>
          <input type="text" name="title" required /><br/>

          <label>Summary:</label>
          <textarea name="summary" required></textarea><br/>

          <button type="submit" className="btn">Create Report</button>
        </form>
        <a href={`/reports?token=${token}`} className="btn">Cancel</a>
      </div>
    </Layout>
  );
}

module.exports = New;

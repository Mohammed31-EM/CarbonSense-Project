const React = require('react');

function Layout({ title, children, token }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'CarbonSense Dashboard'}</title>

        {/* CSS Styles */}
        <link rel="stylesheet" href="/css/style.css" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
        />
      </head>
      <body>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="container">
            <a className="logo" href="/">🌱 CarbonSense</a>
            <ul className="nav-links">
              <li><a href={`/plants?token=${token || ''}`}>Plants</a></li>
              <li><a href={`/equipment?token=${token || ''}`}>Equipment</a></li>
              <li><a href={`/reports?token=${token || ''}`}>Reports</a></li>
              <li><a href="/users/login">Login</a></li>
              <li><a href="/users">Sign Up</a></li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container">
          {children}
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} CarbonSense | Real-Time Industrial Sustainability Monitoring</p>
        </footer>

        {/* Optional Scripts */}
        <script src="/js/main.js"></script>
      </body>
    </html>
  );
}

module.exports = Layout;

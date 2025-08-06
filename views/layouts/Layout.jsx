const React = require('react');

function Layout({ title, children, token, showScript }) {
  const hasToken = !!token;
  const safeToken = token || '';

  // Helper to build links with or without token
  const buildLink = (path) => hasToken ? `${path}?token=${encodeURIComponent(safeToken)}` : path;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'CarbonSense Dashboard'}</title>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        {showScript? <script defer={true} src='/scripts/script.js'></script>: null}
        {hasToken && (
          <script dangerouslySetInnerHTML={{__html: `window.TOKEN = "${encodeURIComponent(safeToken)}";`}} />
        )}
      </head>
      <body>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="container">
            <a className="logo" href={buildLink('/dashboard')}>🌱 CarbonSense</a>
            <ul className="nav-links">
                <li><a href={buildLink('/plants')}>Plants</a></li>
                <li><a href={buildLink('/equipment')}>Equipment</a></li>
                <li><a href={buildLink('/maintenance')}>Maintenance</a></li>
                <li><a href={buildLink('/reports')}>Reports</a></li>

                {!token && (
                  <>
                    <li><a href={buildLink('/users/login')}>Login</a></li>
                    <li><a href={buildLink('/users/signup')}>Sign Up</a></li>
                  </>
                )}
                {token && (
                  <li><a href={buildLink('/users/login')}>Logout</a></li>
                )}
                
            </ul>

          </div>
        </nav>

        {/* Main Content */}
        <main className="container">{children}</main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} CarbonSense | Real-Time Industrial Sustainability Monitoring</p>
        </footer>

      </body>
    </html>
  );
}

module.exports = Layout;

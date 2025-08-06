const React = require('react');

function Layout({ title, children, token, showScript }) {
  const hasToken = !!token;
  const safeToken = token || '';
  const buildLink = (path) => hasToken ? `${path}?token=${encodeURIComponent(safeToken)}` : path;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'CarbonSense Dashboard'}</title>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
        {showScript ? <script defer src='/scripts/script.js'></script> : null}
        {hasToken && (
          <script dangerouslySetInnerHTML={{__html: `window.TOKEN = "${encodeURIComponent(safeToken)}";`}} />
        )}
        <style>{`
          .main-flex {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            gap: 0px;
            min-height: 78vh;
          }
          .main-content {
            flex: 1;
            max-width: 900px;
          }
          .model-sidebar {
            width: 400px;
            min-width: 240px;
            background: transparent
            border-radius: 16px;
            
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px;
            margin-top: 8px;
          }
          model-viewer {
            width: 100%;
            height: 500px;
            
          }
        `}</style>
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

        {/* Main Flex Layout: Content + Model */}
        <div className="main-flex">
          <main className="container main-content">{children}</main>
          <aside className="model-sidebar">
            <model-viewer
              src="/assets/a_windy_day.glb"
              alt="Earth Orbiting Satellites"
              auto-rotate
              camera-controls
              camera-orbit="0deg 75deg 4m"
              shadow-intensity="1"
              enable-zoom
            />
          </aside>
        </div>

        <footer className="footer">
          <p>©️ {new Date().getFullYear()} CarbonSense | Real-Time Industrial Sustainability Monitoring</p>
        </footer>
      </body>
    </html>
  );
}

module.exports = Layout;

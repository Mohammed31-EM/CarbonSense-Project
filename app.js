const express = require('express');
const morgan = require('morgan');
const jsxEngine = require('jsx-view-engine');
const methodOverride = require('method-override');

// ---------- Import Route Controllers ----------
const userRoutes = require('./controllers/auth/routeController');
const plantRoutes = require('./controllers/plant/routeController');
const equipmentRoutes = require('./controllers/equipment/routeController');
const maintenanceRoutes = require('./controllers/maintenance/routeController');
const readingRoutes = require('./controllers/reading/routeController');
const reportRoutes = require('./controllers/report/routeController');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// ---------- View Engine Setup ----------
app.set('view engine', 'jsx');
app.engine('jsx', jsxEngine());

// ---------- Middleware ----------
app.use(express.json()); // For API JSON requests
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(methodOverride('_method')); // Enable PUT & DELETE via forms
app.use((req, res, next) => {
    res.locals.data = {};
    next();
});
app.use(express.static('public'));
app.use(morgan('dev')); // Logs incoming requests

// ---------- Web Routes (Views) ----------
app.use('/users', userRoutes);           // Signup/Login pages
app.use('/plants', plantRoutes);         // Manage plants
app.use('/equipment', equipmentRoutes);  // Manage equipment linked to plants
app.use('/maintenance', maintenanceRoutes); // Manage maintenance logs
app.use('/reading', readingRoutes);      // Manage equipment readings
app.use('/reports', reportRoutes);       // Sustainability reports

// ---------- API Routes (JSON responses) ----------
app.use('/api', apiRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

module.exports = app;

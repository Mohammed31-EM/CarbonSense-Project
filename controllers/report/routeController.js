const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs')

const dataController = require('./dataController');
const apiController = require('./apiController');
const viewController = require('./viewController'); 
const authDataController = require('../auth/dataController');

router.get('/download', (req, res) => {
    console.log('clicked download')
  const file = req.query.file;
  if (!file) return res.status(400).send('No file specified.');

  const filePath = path.join(__dirname, '../../reports', file);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found.');

  res.download(filePath, file, err => {
    if (err) res.status(500).send('Error downloading file.');
  });
});

// --- Web Views ---
router.get('/new', authDataController.auth, viewController.newView); 
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);
router.get('/', authDataController.auth, dataController.index, viewController.index);
router.get('/:id', authDataController.auth, dataController.show, viewController.show);
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome)
router.put('/:id', authDataController.auth, dataController.update, viewController.redirectShow)
router.delete('/:id', authDataController.auth, dataController.destroy, viewController.redirectHome)

// --- API Endpoints ---
router.get('/api', authDataController.auth, dataController.index, apiController.index);
router.get('/api/:id', authDataController.auth, dataController.show, apiController.show);
router.post('/api', authDataController.auth, dataController.create, apiController.create);
router.put('/api/:id', authDataController.auth, dataController.update, apiController.update);
router.delete('/api/:id', authDataController.auth, dataController.destroy, apiController.destroy);

// --- Custom Endpoint for report generation via AJAX ---

module.exports = router;

const express = require('express');
const router = express.Router();

const dataController = require('./dataController');
const apiController = require('./apiController');
const { auth } = require('../auth/dataController');

// ================================
// 📌 REPORT ROUTES (Protected with Auth)
// ================================

// ✅ INDEX - Get all reports
router.get('/', auth, dataController.index, apiController.index);

// ✅ SHOW - Get one report
router.get('/:id', auth, dataController.show, apiController.show);

// ✅ CREATE - Add new report
router.post('/', auth, dataController.create, apiController.show);

// ✅ UPDATE - Edit a report
router.put('/:id', auth, dataController.update, apiController.show);

// ✅ DELETE - Remove a report
router.delete('/:id', auth, dataController.destroy, apiController.destroy);

module.exports = router;

const express = require('express');
const router = express.Router();
const dataController = require('./dataController');
const viewController = require('./viewController');
const plantsViewController = require('../plant/viewController'); 

// SIGNUP: Create a new user, then redirect to login
router.post('/', dataController.createUser, viewController.redirectToLogin);

// SIGNUP PAGE
router.get('/', viewController.signUp);

// LOGIN: Authenticate user, then redirect to plants
router.post('/login', dataController.loginUser, plantsViewController.redirectHome);

// LOGIN PAGE
router.get('/login', viewController.signIn);

// UPDATE: Update user by ID
router.put('/:id', dataController.updateUser);

// DELETE: Delete user (auth required)
router.delete('/:id', dataController.auth, dataController.deleteUser);

module.exports = router;

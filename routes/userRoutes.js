const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for creating a new user
router.post('/create', userController.createUser);

// Route for getting user details
router.get('/:id', userController.getUser);

// Route for updating user details
router.put('/:id', userController.updateUser);

// Route for deleting a user
router.delete('/:id', userController.deleteUser);

module.exports = router;

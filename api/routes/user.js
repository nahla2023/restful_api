const express = require('express'); //this how we import using require
const router = express.Router();
const UserController = require('../controllers/user');

router.post("/signup", UserController.add_user);

router.post('/login', UserController.login);

router.delete('/:userId', UserController.delete_user);

module.exports = router;

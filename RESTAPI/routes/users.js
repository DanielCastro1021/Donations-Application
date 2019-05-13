var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

router.get('/:userId', userController.getOneUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.removeUser);

router.param('userId', userController.getUserById);

module.exports = router;

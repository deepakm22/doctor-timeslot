const express = require('express');
const validationMiddleware = require('../middleware/validationMiddleware')
const { register, login} = require('../controllers/userController');



const router = express.Router();

router.post('/register', validationMiddleware, register)
router.post('/login', validationMiddleware, login)



module.exports = router;
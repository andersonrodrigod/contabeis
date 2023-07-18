const express = require('express')
const router = express.Router()

const AuthController = require('../controller/AuthController')

router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)
router.get('/logout', AuthController.logout)
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)



module.exports = router
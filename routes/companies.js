const express = require('express')
const router = express.Router()
const CompanyController = require('../controller/CompanyController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, CompanyController.dashboard)

router.get('/all', CompanyController.allCompanies)
router.get('/add', checkAuth, CompanyController.createCompany)
router.post('/add', checkAuth, CompanyController.createCompanySave)

module.exports = router

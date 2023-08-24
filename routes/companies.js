const express = require('express')
const router = express.Router()
const CompanyController = require('../controller/CompanyController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, CompanyController.dashboard)
router.get('/all',checkAuth, CompanyController.allCompanies)
router.get('/add', checkAuth, CompanyController.createCompany)
router.post('/add', checkAuth, CompanyController.createCompanySave)
router.get('/company/:id', checkAuth, CompanyController.company)
router.get('/edit/:id', checkAuth, CompanyController.companyEdit)
router.post('/edit/:id', checkAuth, CompanyController.companyEditPost)
router.post('/remove/:id', checkAuth, CompanyController.companyRemovePost)
router.get('/remove/:id', checkAuth, CompanyController.companyRemove)

module.exports = router

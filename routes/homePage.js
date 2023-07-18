const express = require('express')
const router = express.Router()


const HomepageController = require('../controller/HomepageController')

router.get('/', HomepageController.showHome)


module.exports = router
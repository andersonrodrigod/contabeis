const express = require('express')
const router = express.Router()

const ReleasesController = require('../controller/ReleasesController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/allreleases/:id', checkAuth, ReleasesController.allReleases)
router.get('/addreleases/:id', checkAuth, ReleasesController.addReleases)
router.post('/addreleases', checkAuth, ReleasesController.addReleasespost)


module.exports = router
const express = require('express')
const router = express.Router()

router.use(require('../../api/@custom/search'))
router.use(require('../../api/@custom/errors'))
router.use(require('../../api/@custom/channels'))

module.exports = router

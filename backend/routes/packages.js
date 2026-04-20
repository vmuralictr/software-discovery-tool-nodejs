const express = require('express');
const router = express.Router();
const { getSupportedDistros, searchPackages } = require('../controllers/packageController');

router.get('/getSupportedDistros', getSupportedDistros);
router.get('/searchPackages', searchPackages);

module.exports = router;

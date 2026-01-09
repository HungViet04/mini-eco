const express = require('express');
const router = express.Router();
const health = require('../controllers/health.controller');

router.get('/ping', health.ping);
router.get('/db', health.db);

module.exports = router;

const express = require('express');
const router = express.Router();
const { scanUrlHandler, scanTextHandler } = require('../controllers/scanController');

router.post('/url', scanUrlHandler);
router.post('/text', scanTextHandler);

module.exports = router;

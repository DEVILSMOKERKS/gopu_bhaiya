const express = require('express');
const router = express.Router();
const expertInquiryController = require('../controllers/expertInquiry.controller');

router.post('/expert-inquiry', expertInquiryController.createInquiry);

module.exports = router;
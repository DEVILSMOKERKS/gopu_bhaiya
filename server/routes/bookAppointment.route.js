const express = require('express');
const router = express.Router();
const bookAppointmentController = require('../controllers/bookAppointment.controller');

router.post('/book-appointment', bookAppointmentController.createBookAppointment);

module.exports = router;

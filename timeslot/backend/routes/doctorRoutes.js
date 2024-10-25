const express = require('express');
const validationMiddleware = require('../middleware/validationMiddleware')
const { createTimeSlots, viewDoctorSlots, viewAllSlots, bookSlot, viewAllBookedAppointments, cancelBooking, listAllDoctors} = require('../controllers/doctorController');
const authenticateToken = require('../middleware/authMiddleware');



const router = express.Router();

router.post('/createSlot', authenticateToken ,validationMiddleware, createTimeSlots)
router.get('/getSingleSlot', authenticateToken, validationMiddleware, viewDoctorSlots)
router.get('/getAllSlot', authenticateToken, validationMiddleware, viewAllSlots)
router.post('/bookSlot', authenticateToken, validationMiddleware, bookSlot)
router.post('/bookedSlots', authenticateToken, validationMiddleware, viewAllBookedAppointments)
router.post('/cancelBooking', authenticateToken, validationMiddleware, cancelBooking)
router.get('/listAllDoctors', authenticateToken, validationMiddleware, listAllDoctors);




module.exports = router;
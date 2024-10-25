const  {createTimeSlotServices, viewDoctorSlotsServices, viewAllSlotsServices, bookSlotServices, viewAllBookedAppointmentsServices, cancelBookingServices, listAllDoctorsServices}  = require('../services/doctorServices');

exports.createTimeSlots = async (req, res) => {
    const { doctorName, date, startTime, endTime, interval } = req.body;

    try {
    const slots = await createTimeSlotServices(doctorName, date, startTime, endTime, interval);
    return res.status(201).json({
        result: slots,
        message: 'Time slots created successfully',
        status: 'success',
        responseCode: 201,
    });
    } catch (err) {
    return res.status(400).json({
        result: {},
        message: err.message,
        status: 'error',
        responseCode: 400,
    });
    }
};

exports.viewDoctorSlots = async (req, res) => {
    const { doctorName, date } = req.query; 

    try {
        const slots = await viewDoctorSlotsServices(doctorName, date);
        return res.status(200).json({
            result: slots,
            message: 'Slots fetched successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};

exports.viewAllSlots = async (req, res) => {
    const { date } = req.query;

    try {
        const slots = await viewAllSlotsServices(date);
        return res.status(200).json({
            result: slots,
            message: 'All slots for the date fetched successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};

exports.bookSlot = async (req, res) => {
    const { doctorName, date, timeSlot, username } = req.body;

    try {
        const booking = await bookSlotServices(doctorName, date, timeSlot, username);
        return res.status(200).json({
            result: booking,
            message: 'Slot booked successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};

exports.viewAllBookedAppointments = async (req, res) => {
    const { doctorName, date } = req.body; 

    try {
        const bookedSlots = await viewAllBookedAppointmentsServices(doctorName, date);
        return res.status(200).json({
            result: bookedSlots,
            message: 'Booked slots for the doctor fetched successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};

exports.cancelBooking = async (req, res) => {
    const { doctorName, date, startTime, username } = req.body; 
    console.log(req.body);
    
    console.log("Data", doctorName, date, startTime, username)

    try {
        const canceledSlot = await cancelBookingServices(doctorName, date, startTime, username);
        return res.status(200).json({
            result: canceledSlot,
            message: 'Booking canceled successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};


exports.listAllDoctors = async (req, res) => {
    try {
        const doctors = await listAllDoctorsServices();
        return res.status(200).json({
            result: doctors,
            message: 'Doctors fetched successfully',
            status: 'success',
            responseCode: 200,
        });
    } catch (err) {
        return res.status(400).json({
            result: {},
            message: err.message,
            status: 'error',
            responseCode: 400,
        });
    }
};


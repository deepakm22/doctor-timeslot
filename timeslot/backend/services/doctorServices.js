const doctorSchema = require('../models/doctorModel');
const { sendMail } = require('../services/mailServices');


const createTimeSlotServices = async (doctorName, date, startTime, endTime, interval) => {
    const timeSlots = [];
    let currentTime = startTime;

    const existingDoctorSchedule = await doctorSchema.findOne({ doctorName, 'timeSlots.date': date });

    while (currentTime < endTime) {
        const endSlotTime = currentTime + interval;

        const slotExists = existingDoctorSchedule?.timeSlots.some(
            slot => slot.date === date && slot.startTime === currentTime && slot.endTime === endSlotTime
        );

        if (!slotExists) {
            timeSlots.push({
                startTime: currentTime,
                endTime: endSlotTime,
                date,
                isAvailable: true,
            });
        }

        currentTime = endSlotTime;
    }

    if (timeSlots.length > 0) {
        const doctorSchedule = await doctorSchema.findOneAndUpdate(
            { doctorName },
            { $push: { timeSlots: { $each: timeSlots } } },
            { new: true, upsert: true }
        );

        return doctorSchedule;
    } else {
        throw new Error('No new time slots to add. All slots already exist.');
    }
};

const viewDoctorSlotsServices = async (doctorName, date) => {
    const doctor = await doctorSchema.findOne(
    { doctorName, 'timeSlots.date': date },
    { timeSlots: 1 }
    );

    if (!doctor) throw new Error('No slots found for the doctor on this date');

    const slotsForDate = doctor.timeSlots.filter(slot => slot.date === date);
    return slotsForDate;
};

const viewAllSlotsServices = async (date) => {
    const doctors = await doctorSchema.find(
        { 'timeSlots.date': date }, 
        { doctorName: 1, timeSlots: 1 }  
    );

    if (doctors.length === 0) {
        throw new Error('No slots found for the provided date');
    }

    const availableSlots = doctors.map(doctor => ({
        doctorName: doctor.doctorName,
        timeSlots: doctor.timeSlots.filter(slot => slot.date === date && slot.isAvailable)
    }));

    return availableSlots.filter(doctor => doctor.timeSlots.length > 0);
};

const bookSlotServices = async (doctorName, date, timeSlot, username) => {
    const doctor = await doctorSchema.findOne({ doctorName });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const numericTimeSlot = Number(timeSlot);

    const slot = doctor.timeSlots.find(
        slot => slot.date === date && 
                slot.startTime === numericTimeSlot && 
                slot.isAvailable
    );

    if (!slot) {
        throw new Error('Slot is either already booked or not available');
    }

    slot.isAvailable = false;
    slot.bookedBy = username;

    await doctor.save();

    // const doctorEmail = doctor.email; 
    // sendMail(email, 'Slot Booked Successfully', `Dear ${username}, your slot with Dr. ${doctorName} on ${date} at ${timeSlot} has been booked successfully.`);
    // sendMail(doctorEmail, 'New Appointment Booked', `Dear Dr. ${doctorName}, your slot on ${date} at ${timeSlot} has been booked by ${username}.`);


    return slot;  
};

const viewAllBookedAppointmentsServices = async (doctorName, date) => {
    const doctor = await doctorSchema.findOne(
        { doctorName, 'timeSlots.date': date },
        { timeSlots: 1 }
    );

    if (!doctor) {
        throw new Error('Doctor not found or has no slots for the specified date.');
    }

    const bookedSlots = doctor.timeSlots.filter(slot => slot.date === date && !slot.isAvailable);

    if (bookedSlots.length === 0) {
        throw new Error('No booked slots found for this doctor on the specified date.');
    }

    return bookedSlots;
};

const cancelBookingServices = async (doctorName, date, startTime, username) => {
    const doctor = await doctorSchema.findOne({ doctorName });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const numericStartTime = Number(startTime);
    const slot = doctor.timeSlots.find(
        s => s.date === date && s.startTime === numericStartTime && !s.isAvailable && s.bookedBy === username
    );

    if (!slot) {
        throw new Error('No booking found for this slot or you are not authorized to cancel it.');
    }

    slot.isAvailable = true;
    slot.bookedBy = null; 

    await doctor.save();

    return slot; 
};

const listAllDoctorsServices = async () => {
    const doctors = await doctorSchema.find({}); 
    console.log(doctors); 
    if (doctors.length === 0) {
        throw new Error('No doctors found');
    }
    return doctors;
};





module.exports = { createTimeSlotServices ,viewDoctorSlotsServices , viewAllSlotsServices, bookSlotServices, viewAllBookedAppointmentsServices, cancelBookingServices, listAllDoctorsServices};

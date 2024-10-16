const fs = require('fs').promises
const doctorsFilePath = './timeslot.json'

const saveDoctorsData = async (doctors) => {
    try {
        await fs.writeFile(doctorsFilePath, JSON.stringify(doctors, null, 2), 'utf-8');
    } catch (err) {
        console.error(`Failed to save doctors data: ${err.message}`);
    }
};

const loadDoctorsData = async () => {
    try {
    const doctorsData = await fs.readFile(doctorsFilePath, 'utf-8');
        return JSON.parse(doctorsData);
    } catch (err) {
    console.log('Doctors data file does not exist. Creating a new one...');
        await saveDoctorsData([]);  
        return [];  
    }
};

const createTimeSlotsWithInterval = async (doctorName, date, startHour, endHour, interval) => {
    try {
        if (startHour < 1 || startHour > 24 || endHour < 1 || endHour > 24) {
            console.log('Hours must be between 1 and 24.');
            return;
        }
        if (startHour >= endHour) {
            console.log('Start hour must be less than end hour.');
            return;
        }

const doctors = await loadDoctorsData();
let doctor = doctors.find(d => d.doctorName === doctorName);
    if (!doctor) {
        doctor = {
            doctorName: doctorName,
            timeSlots: []
        };
        doctors.push(doctor);
    }

const breakStart = 13; 
const breakEnd = 14;
for (let hour = startHour; hour < endHour; hour += interval) {
    if (hour >= breakStart && hour < breakEnd) {
        continue; 
}

const startTimeHour = Math.floor(hour);
const startTimeMinutes = (hour % 1) * 60; 
const startTime = `${startTimeHour.toString()}:${startTimeMinutes === 0 ? '00' : '30'}`; 
const endHourWithInterval = Math.floor(hour + interval);
const endMinutes = Math.round((interval % 1) * 60);
const endTime = `${endHourWithInterval.toString()}:${endMinutes.toString().padStart(2, '0')}`;

    doctor.timeSlots.push({
    date: date, 
    startTime: startTime,
    endTime: endTime,
    isAvailable: true
});
    console.log(`New time slot from ${startTime} to ${endTime} on ${date} added for ${doctorName}.`);
}

        await saveDoctorsData(doctors);
    } catch (err) {
        console.error(`Error creating time slots: ${err.message}`);
    }
};


const bookDoctorSlot = async (doctorName, date, timeSlot, userName) => {
    try {
        const doctors = await loadDoctorsData();
        const doctor = doctors.find(d => d.doctorName === doctorName);

        if (!doctor) {
            console.log(`Doctor ${doctorName} not found.`);
            return;
        }

const slot = doctor.timeSlots.find(slot => 
    slot.date === date && 
    slot.startTime === timeSlot.startTime && 
    slot.endTime === timeSlot.endTime
    );

        if (slot && slot.isAvailable) {
            slot.isAvailable = false; 
            slot.bookedBy = userName;
            console.log(`${userName} successfully booked a slot with ${doctorName} from ${slot.startTime} to ${slot.endTime} on ${date}`);
        } else {
            console.log(`Time slot is not available for booking.`);
        }
        
        await saveDoctorsData(doctors);  
    } catch (err) {
        console.error(`Error booking slot: ${err.message}`);
    }
};

const listAvailableSlots = async (doctorName, date) => {
    try {
        const doctors = await loadDoctorsData();
        const doctor = doctors.find(d => d.doctorName === doctorName);
        
        if (!doctor) {
            console.log(`Doctor ${doctorName} not found.`);
            return;
        }

        const availableSlots = doctor.timeSlots.filter(slot => slot.isAvailable && slot.date === date); 
        if (availableSlots.length === 0) {
            console.log(`No available slots for ${doctorName} on ${date}.`);
        } else {
            console.log(`Available slots for ${doctorName} on ${date}:`);
            availableSlots.forEach((slot) => {
                console.log(`${slot.startTime} to ${slot.endTime}`);
            });
        }
    } catch (err) {
        console.error(`Error listing available slots: ${err.message}`);
    }
};

const cancelBooking = async (doctorName, date, timeSlot, userName) => {
    try {
        const doctors = await loadDoctorsData();
        const doctor = doctors.find(d => d.doctorName === doctorName);
        
        if (!doctor) {
            console.log(`Doctor ${doctorName} not found.`);
            return;
        }

        const slot = doctor.timeSlots.find(
            (slot) =>
                slot.date === date && 
                slot.startTime === timeSlot.startTime &&
                slot.endTime === timeSlot.endTime &&
                slot.bookedBy === userName
        );

        if (slot && !slot.isAvailable) {
            slot.isAvailable = true;
            delete slot.bookedBy;
            console.log(
                `${userName} successfully cancelled the booking for ${doctorName} from ${slot.startTime} to ${slot.endTime} on ${date}`
            );
        } else {
            console.log(`No booking found for the given time slot.`);
        }
        
        await saveDoctorsData(doctors);  
    } catch (err) {
        console.error(`Error cancelling booking: ${err.message}`);
    }
};

const date = "2024-10-22"; 
createTimeSlotsWithInterval("Dr. Arul", date, 9, 18, 1);
// bookDoctorSlot("Dr. Arul", date, { startTime: "10:00", endTime: "11:00" }, "Deepak");
// listAvailableSlots("Dr. Arul", date);
// cancelBooking("Dr. Arul", date, { startTime: "10:00", endTime: "11:00" }, "Deepak");

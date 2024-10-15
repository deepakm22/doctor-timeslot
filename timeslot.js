const getTomorrowDate = () => {
    const tomorrow = new Date(Date.now() + 86400000); 
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
};

const appointmentDate = getTomorrowDate();

const doctors = [
    {
        doctorName: "Dr. Prakash",
        date: appointmentDate,
        timeSlots: [{ startTime: "09:00", endTime: "09:30", isAvailable: true },
            { startTime: "03:00", endTime: "03:30", isAvailable: true }
        ]
    },
    {
        doctorName: "Dr. Vijay",
        date: appointmentDate,
        timeSlots: [{ startTime: "09:30", endTime: "10:00", isAvailable: true },
            { startTime: "03:30", endTime: "04:00", isAvailable: true }
        ]
    },
    {
        doctorName: "Dr. Murali",
        date: appointmentDate,
        timeSlots: [{ startTime: "10:00", endTime: "10:30", isAvailable: true },
            { startTime: "04:00", endTime: "04:30", isAvailable: true }
        ]
    },
    {
        doctorName: "Dr. Arul",
        date: appointmentDate,
        timeSlots: [{ startTime: "10:30", endTime: "11:00", isAvailable: true },
            { startTime: "04:30", endTime: "05:00", isAvailable: true }
        ]
    },
    {
        doctorName: "Dr. Hari",
        date: appointmentDate,
        timeSlots: [{ startTime: "11:00", endTime: "11:30", isAvailable: true },
            { startTime: "05:30", endTime: "06:00", isAvailable: true }
        ]
    }
];

const users = [
    { userName: "Deepak" },
    { userName: "Batcha" },
    { userName: "Nithin" },
    { userName: "Dhanan" },
    { userName: "Novfal" }
];

const createDoctorAvailability = (doctorName, date, timeSlots) => {
    return {
        doctorName: doctorName,
        date: date,
        availability: timeSlots.map((slot) => {
            return {
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: slot.isAvailable
            };
        })
    };
};

const bookDoctorSlot = (doctorName, timeSlot, userName) => {
    const doctor = doctors.find(d => d.doctorName === doctorName);
    
    if (!doctor) {
        console.log(`Doctor ${doctorName} not found.`);
        return;
    }

    const slot = doctor.timeSlots.find(slot => 
        slot.startTime === timeSlot.startTime && slot.endTime === timeSlot.endTime);

    if (slot && slot.isAvailable) {
        slot.isAvailable = false; 
        slot.bookedBy = userName; 
        console.log(`${userName} successfully booked a slot with ${doctorName} from ${slot.startTime} to ${slot.endTime}`);
    } else {
        console.log(`Time slot is not available for booking.`);
    }
};

const listAvailableSlots = (doctorName) => {
    const doctor = doctors.find(d => d.doctorName === doctorName);
    if (!doctor) {
        console.log(`Doctor ${doctorName} not found.`);
        return;
    }

    const availableSlots = doctor.timeSlots.filter(slot => slot.isAvailable);
    if (availableSlots.length === 0) {
        console.log(`No available slots for ${doctorName}.`);
    } else {
        console.log(`Available slots for ${doctorName}:`);
        availableSlots.forEach((slot) => {
            console.log(`From ${slot.startTime} to ${slot.endTime}`);
        });
    }
};

const cancelBooking = (doctorName, timeSlot, userName) => {
    const doctor = doctors.find(d => d.doctorName === doctorName);
    if (!doctor) {
        console.log(`Doctor ${doctorName} not found.`);
        return;
    }

    const slot = doctor.timeSlots.find(
        (slot) =>
            slot.startTime === timeSlot.startTime &&
            slot.endTime === timeSlot.endTime &&
            slot.bookedBy === userName
    );

    if (slot && !slot.isAvailable) {
        slot.isAvailable = true;
        delete slot.bookedBy;
        console.log(
            `${userName} successfully cancelled the booking for ${doctorName} from ${slot.startTime} to ${slot.endTime}`
        );
    } else {
        console.log(`No booking found for the given time slot.`);
    }
};



bookDoctorSlot("Dr. Prakash", { startTime: "09:00", endTime: "09:30" }, "Deepak");
bookDoctorSlot("Dr. Prakash", { startTime: "09:00", endTime: "09:30" }, "Batcha");

listAvailableSlots("Dr. Prakash");

// cancelBooking("Dr. Prakash", { startTime: "09:00", endTime: "09:30" }, "Batcha");


console.log(JSON.stringify(doctors, null, 2));

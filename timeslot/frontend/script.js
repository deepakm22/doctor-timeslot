let doctors = [];

const loadDoctorsFromStorage = () => {
    const storedDoctors = localStorage.getItem('doctors');
    if (storedDoctors) {
        doctors = JSON.parse(storedDoctors);
        console.log('Loaded doctors:', doctors);
        markPastSlotsAsUnavailable();
    }
};

const saveDoctorsToStorage = () => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
};

const markPastSlotsAsUnavailable = () => {
    const currentDate = new Date(); 

    doctors.forEach(doctor => {
        doctor.timeSlots.forEach(slot => {
            const slotDate = new Date(slot.date); 
            if (slotDate < currentDate) {
                slot.isAvailable = false; 
            }
        });
    });

    saveDoctorsToStorage(); 
};

const showSection = (sectionId) => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const buttons = document.querySelectorAll('.sidebar button');
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(sectionId).classList.add('active');

    const clickedButton = document.querySelector(`.sidebar button[onclick="showSection('${sectionId}')"]`);
    clickedButton.classList.add('active');

    if (sectionId === 'adminSection') {
        if (isAdmin()) {
            viewAllBookedSlotsForAdmin(); 
        } else {
            alert('Unauthorized access!'); 
        }
    }
};

const populateDoctorDropdowns = () => {
    const bookDoctorSelect = document.getElementById('bookDoctorName');
    const cancelDoctorSelect = document.getElementById('cancelDoctorName');

    bookDoctorSelect.innerHTML = '';
    cancelDoctorSelect.innerHTML = '';

    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorName;
        option.textContent = doctor.doctorName;

        bookDoctorSelect.appendChild(option);
        cancelDoctorSelect.appendChild(option.cloneNode(true));
    });

    if (bookDoctorSelect.value) {
        populateAvailableSlots('book');
    }
    if (cancelDoctorSelect.value) {
        populateAvailableSlots('cancel');
    }
};

const populateAvailableSlots = (section) => {
    const doctorName = section === 'book' ? document.getElementById('bookDoctorName').value : document.getElementById('cancelDoctorName').value;
    const date = section === 'book' ? document.getElementById('bookDate').value : document.getElementById('cancelDate').value;
    const timeSlotSelect = section === 'book' ? document.getElementById('bookTimeSlot') : document.getElementById('cancelTimeSlot');

    timeSlotSelect.innerHTML = '';

    console.log('Selected Doctor:', doctorName);
    console.log('Selected Date:', date);

    const doctor = doctors.find(d => d.doctorName === doctorName);
    if (doctor && date) {
        const availableSlots = section === 'book' 
            ? doctor.timeSlots.filter(slot => slot.date === date && slot.isAvailable)
            : doctor.timeSlots.filter(slot => slot.date === date && !slot.isAvailable);

        console.log('Available Slots:', availableSlots);

        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.startTime;
            option.textContent = `${slot.startTime} to ${slot.endTime}`;
            timeSlotSelect.appendChild(option);
        });

        if (availableSlots.length === 0) {
            const option = document.createElement('option');
            option.textContent = section === 'book' ? 'No available slots' : 'No booked slots to cancel';
            timeSlotSelect.appendChild(option);
        }
    } else {
        console.log('Doctor not found or date not selected.');
    }
};

const createTimeSlots = () => {
    const doctorName = document.getElementById('doctorName').value;
    const date = document.getElementById('date').value;
    const startHour = parseFloat(document.getElementById('startHour').value);
    const endHour = parseFloat(document.getElementById('endHour').value);
    const interval = parseFloat(document.getElementById('interval').value);

    if (!doctorName || !date || isNaN(startHour) || isNaN(endHour) || isNaN(interval) || endHour <= startHour) {
        document.getElementById('createOutput').innerText = 'Please fill in all fields correctly.';
        return;
    }

    let timeSlots = [];
    for (let hour = startHour; hour < endHour; hour += interval) {
        timeSlots.push({
            startTime: hour,
            endTime: hour + interval,
            date: date,
            isAvailable: true
        });
    }

    const existingDoctor = doctors.find(doctor => doctor.doctorName === doctorName);
    if (existingDoctor) {
        existingDoctor.timeSlots.push(...timeSlots);
    } else {
        doctors.push({ doctorName: doctorName, timeSlots: timeSlots });
    }

    saveDoctorsToStorage();
    markPastSlotsAsUnavailable();
    document.getElementById('createOutput').innerText = 'Time slots created successfully!';
    document.getElementById('doctorName').value = '';
    document.getElementById('date').value = '';
    document.getElementById('startHour').value = '';
    document.getElementById('endHour').value = '';
    document.getElementById('interval').value = '';};

    const viewTimeSlots = () => {
        const doctorName = document.getElementById('viewDoctorName').value;
        const date = document.getElementById('viewDate').value;
    
        const output = document.getElementById('viewOutput');
        output.innerHTML = ''; 
    
        const doctor = doctors.find(d => d.doctorName === doctorName);
        if (doctor) {
            const availableSlots = doctor.timeSlots.filter(slot => slot.date === date && slot.isAvailable);
            if (availableSlots.length > 0) {
                availableSlots.forEach(slot => {
                    const slotButton = document.createElement('button');
                    slotButton.classList.add('slot-button');
                    slotButton.textContent = `${slot.startTime} to ${slot.endTime} (Avilable)`;
                    slotButton.style.backgroundColor = '#4CAF50'; 
    
                    slotButton.addEventListener('click', () => {
                        console.log(`Booking ${doctor.doctorName} on ${slot.date} from ${slot.startTime} to ${slot.endTime}`);
                    });
    
                    output.appendChild(slotButton);
                });
            } else {
                output.innerHTML = 'No available slots for this doctor on this date.';
            }
        } else {
            output.innerHTML = 'Doctor not found.';
        }
    };

const viewAllTimeSlots = () => {
    const output = document.getElementById('allSlotsOutput');
    output.innerHTML = '';

    doctors.forEach(doctor => {
        output.innerHTML += `<h3>Dr. ${doctor.doctorName}</h3>`;

        doctor.timeSlots.forEach(slot => {
            const slotButton = document.createElement('button');
            slotButton.classList.add('slot-button');
            slotButton.textContent = `${slot.date}: ${slot.startTime} to ${slot.endTime}  ${slot.isAvailable ? 'Available' : 'Booked'}`;
            slotButton.disabled = !slot.isAvailable; 
            slotButton.style.backgroundColor = slot.isAvailable ? '#4CAF50' : 'rgb(201, 198, 198)'; 

            if (slot.isAvailable) {
                slotButton.addEventListener('click', () => {
                    console.log(`Booking ${doctor.doctorName} on ${slot.date} from ${slot.startTime} to ${slot.endTime}`);
                });
            }

            output.appendChild(slotButton);
        });
    });
};

const bookSlot = () => {
    const doctorName = document.getElementById('bookDoctorName').value;
    const date = document.getElementById('bookDate').value;
    const startTime = document.getElementById('bookTimeSlot').value;
    const userName = document.getElementById('userName').value;

    if (!userName) {
        document.getElementById('bookOutput').innerText = 'Please enter your name.';
        return;
    }

    const doctor = doctors.find(d => d.doctorName === doctorName);
    if (doctor) {
        console.log('Booking Doctor:', doctorName);
        console.log('Selected Date:', date);
        console.log('Selected Start Time:', startTime);

        const slot = doctor.timeSlots.find(s => s.startTime.toString() === startTime && s.date === date);
        
        if (slot && slot.isAvailable) {
            slot.isAvailable = false; 
            slot.bookedBy = userName; 
            saveDoctorsToStorage(); 
            document.getElementById('bookOutput').innerText = 'Slot booked successfully!';

            document.getElementById('bookDoctorName').value = '';
            document.getElementById('bookDate').value = '';
            document.getElementById('bookTimeSlot').innerHTML = ''; 
            document.getElementById('userName').value = '';
        } else {
            document.getElementById('bookOutput').innerText = 'Slot is already booked or does not exist.';
        }
    } else {
        document.getElementById('bookOutput').innerText = 'Doctor not found.';
    }
};

const cancelBooking = () => {
    const doctorName = document.getElementById('cancelDoctorName').value;
    const date = document.getElementById('cancelDate').value;
    const startTime = document.getElementById('cancelTimeSlot').value;
    const userName = document.getElementById('cancelUserName').value;

    if (!userName) {
        document.getElementById('cancelOutput').innerText = 'Please enter your name.';
        return;
    }

    const doctor = doctors.find(d => d.doctorName === doctorName);
    if (doctor) {
        const slot = doctor.timeSlots.find(s => s.startTime.toString() === startTime && s.date === date);
        console.log('Cancel Booking - Slot Found:', slot); 

        if (slot && !slot.isAvailable && slot.bookedBy === userName) {
            slot.isAvailable = true; 
            delete slot.bookedBy; 
            saveDoctorsToStorage();
            document.getElementById('cancelOutput').innerText = 'Booking canceled successfully!';

            document.getElementById('cancelDoctorName').value = '';
            document.getElementById('cancelDate').value = '';
            document.getElementById('cancelTimeSlot').innerHTML = ''; 
            document.getElementById('cancelUserName').value = '';
        } else {
            document.getElementById('cancelOutput').innerText = 'No booking found for this slot or you are not authorized to cancel it.';
        }
    } else {
        document.getElementById('cancelOutput').innerText = 'Doctor not found.';
    }
};

const viewAllBookedSlotsForAdmin = () => {
    const output = document.getElementById('adminBookedSlotsOutput');
    output.innerHTML = ''; 

    let hasBookedSlots = false; 

    doctors.forEach(doctor => {
        doctor.timeSlots.forEach(slot => {
            if (!slot.isAvailable && slot.bookedBy) {
                hasBookedSlots = true;

                const bookedInfo = document.createElement('div');
                bookedInfo.classList.add('booked-slot-info');

                bookedInfo.innerHTML = `
                    <h4>Doctor: Dr. ${doctor.doctorName}</h4>
                    <p>Date: ${slot.date}</p>
                    <p>Time: ${slot.startTime} to ${slot.endTime}</p>
                    <p>Booked By: ${slot.bookedBy}</p>
                `;

                output.appendChild(bookedInfo);
            }
        });
    });

    if (!hasBookedSlots) {
        output.innerHTML = 'No booked slots available.';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadDoctorsFromStorage(); 
    populateDoctorDropdowns(); 

    const loggedInUser = localStorage.getItem('loggedInUser'); 
    const loggedInUserName = localStorage.getItem('loggedInUserName'); 

    const userInfo = document.getElementById('userInfo'); 
    const usernameDisplay = document.getElementById('usernameDisplay'); 

    if (loggedInUser && loggedInUserName) {
        document.getElementById('loginButtonContainer').style.display = 'none';
        document.getElementById('logoutButtonContainer').style.display = 'block';
        usernameDisplay.innerText = `Welcome, ${loggedInUserName}`; 

        userInfo.style.display = 'flex'; 
    } else {
        document.getElementById('loginButtonContainer').style.display = 'block';
        document.getElementById('logoutButtonContainer').style.display = 'none';
        usernameDisplay.innerText = ''; 
    }
});


const showLogin = () => {
    window.location.href = '../timeslot/frontend/login/login.html'; 
};

const logout = () => {
    localStorage.removeItem('loggedInUser');
    
    document.getElementById('loginButtonContainer').style.display = 'block';
    document.getElementById('logoutButtonContainer').style.display = 'none';
    window.location.reload();
};

loadDoctorsFromStorage();



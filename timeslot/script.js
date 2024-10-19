let doctors = [];

const loadDoctorsFromStorage = () => {
    const storedDoctors = localStorage.getItem('doctors');
    if (storedDoctors) {
        doctors = JSON.parse(storedDoctors);
        console.log('Loaded doctors:', doctors);
    }
};

const saveDoctorsToStorage = () => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
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
        output.innerHTML = ''; // Clear previous output
    
        const doctor = doctors.find(d => d.doctorName === doctorName);
        if (doctor) {
            const availableSlots = doctor.timeSlots.filter(slot => slot.date === date && slot.isAvailable);
            if (availableSlots.length > 0) {
                availableSlots.forEach(slot => {
                    const slotButton = document.createElement('button');
                    slotButton.classList.add('slot-button');
                    slotButton.textContent = `${slot.startTime} to ${slot.endTime}`;
                    slotButton.style.backgroundColor = '#4CAF50'; // Green for available
    
                    // Add event listener for booking
                    slotButton.addEventListener('click', () => {
                        console.log(`Booking ${doctor.doctorName} on ${slot.date} from ${slot.startTime} to ${slot.endTime}`);
                        // You can call the bookSlot function or implement any other booking logic here
                    });
    
                    output.appendChild(slotButton); // Append button to output
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
            slotButton.style.backgroundColor = slot.isAvailable ? '#4CAF50' : '#f44336'; 

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

    // Check if userName is provided
    if (!userName) {
        document.getElementById('bookOutput').innerText = 'Please enter your name.';
        return;
    }

    // Find the doctor
    const doctor = doctors.find(d => d.doctorName === doctorName);
    if (doctor) {
        console.log('Booking Doctor:', doctorName);
        console.log('Selected Date:', date);
        console.log('Selected Start Time:', startTime);

        // Find the slot that matches the date and start time
        const slot = doctor.timeSlots.find(s => s.startTime.toString() === startTime && s.date === date);
        
        // Check if the slot is available
        if (slot && slot.isAvailable) {
            // Update the slot to mark it as booked and store the user's name
            slot.isAvailable = false; 
            slot.bookedBy = userName; // Add the bookedBy property to the slot
            saveDoctorsToStorage(); // Save updated data to local storage
            document.getElementById('bookOutput').innerText = 'Slot booked successfully!';

            // Clear the input fields
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
        console.log('Cancel Booking - Slot Found:', slot); // Debugging line

        // Check if the slot is booked by the user
        if (slot && !slot.isAvailable && slot.bookedBy === userName) {
            slot.isAvailable = true; 
            delete slot.bookedBy; // Remove the bookedBy property
            saveDoctorsToStorage();
            document.getElementById('cancelOutput').innerText = 'Booking canceled successfully!';

            // Clear fields after cancellation
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
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loggedInUserName = localStorage.getItem('loggedInUserName');
    const userInfo = document.getElementById('userInfo');
    
    userInfo.style.display = 'flex'; 

    if (loggedInUser) {
        document.getElementById('loginButtonContainer').style.display = 'none';
        document.getElementById('logoutButtonContainer').style.display = 'block';
        document.getElementById('usernameDisplay').innerText = `Welcome, ${loggedInUserName}`;
        
        userInfo.style.display = 'flex'; 
    }else {
        document.getElementById('loginButtonContainer').style.display = 'block';
        document.getElementById('logoutButtonContainer').style.display = 'none';
        document.getElementById('usernameDisplay').innerText = ''; 
    }
});


const showLogin = () => {
    window.location.href = 'login.html'; 
};

const logout = () => {
    localStorage.removeItem('loggedInUser');
    
    document.getElementById('loginButtonContainer').style.display = 'block';
    document.getElementById('logoutButtonContainer').style.display = 'none';
    window.location.reload();
};


loadDoctorsFromStorage();




















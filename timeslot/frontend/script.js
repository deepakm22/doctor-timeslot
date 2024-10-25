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

const viewTimeSlots = async () => {
    const doctorName = document.getElementById('viewDoctorName').value;
    const date = document.getElementById('viewDate').value;

    const output = document.getElementById('viewOutput');
    output.innerHTML = ''; 

    try {
        const queryParams = new URLSearchParams({
            doctorName: doctorName,
            date: date,
        });

        const response = await fetch(`http://localhost:3000/api/doctor/getSingleSlot?${queryParams.toString()}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            }
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); 
        const availableSlots = data.result.filter(slot => slot.isAvailable); 

        if (availableSlots.length > 0) {
            availableSlots.forEach(slot => {
                const slotButton = document.createElement('button');
                slotButton.classList.add('slot-button');
                slotButton.textContent = `${slot.startTime} to ${slot.endTime} (Available)`;
                slotButton.style.backgroundColor = '#4CAF50'; 

                slotButton.addEventListener('click', () => {
                    console.log(`Booking ${doctorName} on ${date} from ${slot.startTime} to ${slot.endTime}`);
                });

                output.appendChild(slotButton); 
            });
        } else {
            output.innerHTML = 'No available slots for this doctor on this date.';
        }
    } catch (error) {
        console.error('Error:', error);
        output.innerHTML = 'An error occurred while fetching slots: ' + error.message; 
    }
};

const viewAllTimeSlots = async () => {
    const date = document.getElementById('viewAllDate').value.trim(); 

    const output = document.getElementById('allSlotsOutput');
    output.innerHTML = ''; 

    if (!date) { 
        console.error('Date is required to fetch slots.');
        output.innerHTML = 'Please select a date to view available time slots.';
        return; 
    }

    try {
        const queryParams = new URLSearchParams({ date }); 
        console.log('Fetching time slots with query params:', queryParams.toString()); 
        
        const response = await fetch(`http://localhost:3000/api/doctor/getAllSlot?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
        });

        console.log('Response status:', response.status); 

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); 
        console.log('Response data:', data);

        const doctors = data.result; 
        console.log("testing",doctors);
        

        if (doctors && doctors.length > 0) {  
            doctors.forEach(doctor => {
                output.innerHTML += `<h3>Dr. ${doctor.doctorName}</h3>`; 

                if (doctor.timeSlots && doctor.timeSlots.length > 0) { 
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
                } else {
                    output.innerHTML += `<p>No available time slots for Dr. ${doctor.doctorName} on this date.</p>`;
                }
            });
        } else {
            output.innerHTML = 'No doctors available for the selected date.';
        }
    } catch (error) {
        console.error('Error:', error);
        output.innerHTML = 'An error occurred while fetching time slots: ' + error.message; 
    }
};

const fetchAllDoctors =  async () => {
    try {
        const response = await fetch('http://localhost:3000/api/doctor/listAllDoctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data.result
        } else {
            console.error('Error fetching doctors:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const loadDoctors = async () => {
    const doctors = await fetchAllDoctors();
    const doctorDropdown = document.getElementById('bookDoctorName');
    const cancelDoctorDropdown = document.getElementById('cancelDoctorName');
    
    if (doctors) {
        if (doctorDropdown) {
            doctorDropdown.innerHTML = '<option value="">Select a doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.doctorName; 
                option.text = doctor.doctorName;
                doctorDropdown.appendChild(option);
            });
        }

        if (cancelDoctorDropdown) {
            cancelDoctorDropdown.innerHTML = '<option value="">Select a doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.doctorName; 
                option.text = doctor.doctorName;
                cancelDoctorDropdown.appendChild(option);
            });
        }
    }
};

const loadTimeSlots = async (isCancel = false) => {
    const selectedDoctor = isCancel ? document.getElementById('cancelDoctorName').value : document.getElementById('bookDoctorName').value;
    const selectedDate = isCancel ? document.getElementById('cancelDate').value : document.getElementById('bookDate').value;

    const doctors = await fetchAllDoctors();
    const doctor = doctors.find(doc => doc.doctorName === selectedDoctor);
    
    const timeSlotDropdown = isCancel ? document.getElementById('cancelTimeSlot') : document.getElementById('bookTimeSlot');
    timeSlotDropdown.innerHTML = '<option value="">Select a time slot</option>';

    if (doctor) {
        const availableSlots = doctor.timeSlots.filter(slot => 
            slot.date === selectedDate && (isCancel ? !slot.isAvailable : slot.isAvailable)
        );

        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = `${slot.startTime}`; 
            option.text = `${slot.startTime}:00 - ${slot.endTime}:00`; 
            timeSlotDropdown.appendChild(option);
        });
    }
};

document.addEventListener('DOMContentLoaded', loadDoctors);
document.getElementById('bookDoctorName').addEventListener('change', () => loadTimeSlots());
document.getElementById('bookDate').addEventListener('change', () => loadTimeSlots());
document.getElementById('cancelDoctorName').addEventListener('change', () => loadTimeSlots(true));
document.getElementById('cancelDate').addEventListener('change', () => loadTimeSlots(true));

const bookSlot = async () => {
    const doctorName = document.getElementById('bookDoctorName').value;
    const date = document.getElementById('bookDate').value;
    const startTime = document.getElementById('bookTimeSlot').value;
    const userName = document.getElementById('userName').value;

    if (!userName) {
        document.getElementById('bookOutput').innerText = 'Please enter your name.';
        return;
    }

    else if (!startTime ) {
        document.getElementById('bookOutput').innerText = 'Please select a valid time slot.';
        return;
    }else{


    console.log('Doctor Name:', doctorName);
    console.log('Date:', date);
    console.log('Selected Time Slot:', startTime);
    console.log('User Name:', userName);



    try {
        
        const response = await fetch('http://localhost:3000/api/doctor/bookSlot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,  
            },
            body: JSON.stringify({
                doctorName,
                date,
                timeSlot: startTime,
                username: userName
            }),
        });
        const data = await response.json();
        console.log("Response Data:", data);        
        
        if (response.ok) {
            document.getElementById('bookOutput').innerText = data.message || 'Slot booked successfully!';

            document.getElementById('bookDoctorName').value = '';
            document.getElementById('bookDate').value = '';
            document.getElementById('bookTimeSlot').value = '';
            document.getElementById('userName').value = '';
        } else {
            console.error(`Failed booking attempt: Status ${response.status}`, data); 

            document.getElementById('bookOutput').innerText = data.message || 'Failed to book slot.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('bookOutput').innerText = 'An error occurred while booking the slot.';
    }
}
};

const cancelBooking = async () => {
    const doctorName = document.getElementById('cancelDoctorName').value;
    const date = document.getElementById('cancelDate').value;
    const startTime = document.getElementById('cancelTimeSlot').value;
    const userName = document.getElementById('cancelUserName').value;

    if (!userName) {
        document.getElementById('cancelOutput').innerText = 'Please enter your name.';
        return;
    } else if (!startTime) {
        document.getElementById('cancelOutput').innerText = 'Please select a valid time slot.';
        return;
    }

    console.log('Doctor Name:', doctorName,typeof(doctorName));
    console.log('Date:', date,typeof(date));
    console.log('Selected Time Slot:', startTime, typeof(startTime));
    console.log('User Name:', userName, typeof(userName));

    try {
        const response = await fetch('http://localhost:3000/api/doctor/cancelBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                doctorName,
                date,
                startTime: startTime,
                username: userName
            }),
        });

        const data = await response.json();
        console.log("Response Data:", data);        

        if (response.ok) {
            document.getElementById('cancelOutput').innerText = data.message || 'Slot canceled successfully!';

            document.getElementById('cancelDoctorName').value = '';
            document.getElementById('cancelDate').value = '';
            document.getElementById('cancelTimeSlot').value = '';
            document.getElementById('cancelUserName').value = '';
        } else {
            console.error(`Failed cancel attempt: Status ${response.status}`, data);
            document.getElementById('cancelOutput').innerText = data.message || 'Failed to cancel slot.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('cancelOutput').innerText = 'An error occurred while canceling the appointment.';
    }
};

const updateLoginStatus = () => {
    const isLoggedIn = !!localStorage.getItem('token'); 
    const loginButtonContainer = document.getElementById('loginButtonContainer');
    const logoutButtonContainer = document.getElementById('logoutButtonContainer');

    if (isLoggedIn) {
        loginButtonContainer.style.display = 'none';
        logoutButtonContainer.style.display = 'block';
    } else {
        loginButtonContainer.style.display = 'block';
        logoutButtonContainer.style.display = 'none';
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUserName');

    updateLoginStatus();

    window.location.href = '/timeslot/frontend/login/login.html'; 
};

updateLoginStatus();

const showLogin = () => {
    window.location.href = '/timeslot/frontend/login/login.html'; 
};

const displayStoredUsername = () => {
    const usernameDisplayElement = document.getElementById('usernameDisplay');
    const storedUsername = localStorage.getItem('loggedInUserName');

    if (storedUsername && usernameDisplayElement) {
        usernameDisplayElement.textContent = `Welcome, ${storedUsername}!`;
    }
};


displayStoredUsername();

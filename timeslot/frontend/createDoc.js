const createTimeSlots = async () => {
    const doctorName = document.getElementById('doctorName').value.trim();
    const date = document.getElementById('date').value;
    const startHour = parseFloat(document.getElementById('startHour').value);
    const endHour = parseFloat(document.getElementById('endHour').value);
    const interval = parseFloat(document.getElementById('interval').value);

    if (!doctorName || !date || isNaN(startHour) || isNaN(endHour) || isNaN(interval) || endHour <= startHour) {
        document.getElementById('createOutput').innerText = 'Please fill in all fields correctly.';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/doctor/createSlot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            body: JSON.stringify({
                doctorName,
                date,
                startTime: startHour,
                endTime: endHour,
                interval,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        document.getElementById('createOutput').innerText = data.message || 'Time slots created successfully!';

        document.getElementById('doctorName').value = '';
        document.getElementById('date').value = '';
        document.getElementById('startHour').value = '';
        document.getElementById('endHour').value = '';
        document.getElementById('interval').value = '';

        document.getElementById('createOutput').innerText = 'Time slots created successfully!'
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('createOutput').innerText = 'An error occurred while creating time slots: ' + error.message;
    }
};

const viewMyAppointment = async () => {
    const date = document.getElementById('viewAllDate').value;
    const doctorName = localStorage.getItem('loggedInUserName');

    const output = document.getElementById('adminBookedSlotsOutput');
    output.style.display = 'block'
    output.innerHTML = ''; 

    try {
        const response = await fetch('http://localhost:3000/api/doctor/bookedSlots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            body: JSON.stringify({
                doctorName,
                date
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const bookedSlots = data.result; 
        
        if (bookedSlots && bookedSlots.length > 0) {
            bookedSlots.forEach(slot => {
                if (!slot.isAvailable) {
                    output.innerHTML += `
                        <div class="appointment-container">
                            <h2 class="patient-name">Patient: ${slot.bookedBy}</h2> 
                            <p class="appointment-details">Slot: ${slot.startTime} to ${slot.endTime}</p>
                            <p class="appointment-details">Status: Booked</p>
                        </div>
                    `;
                }
            });
        } else {
            output.innerHTML = '<p class="no-appointments">No booked slots for the selected date.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        output.innerText = 'An error occurred while fetching booked slots: ' + error.message;
    }
}

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

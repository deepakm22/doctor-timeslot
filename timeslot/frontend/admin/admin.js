const createDoctor = async () => {
    const doctorName = document.getElementById('doctorName').value.trim();
    const doctorEmail = document.getElementById('doctorEmail').value.trim();
    const doctorPassword = document.getElementById('doctorPassword').value;
    const doctorRole = document.getElementById('doctorRole').value; 

    if (!doctorName || !doctorEmail || !doctorPassword) {
        alert('Please fill in all fields.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(doctorEmail)) {
        alert('Please enter a valid email address.');
        return;
    }

    console.log({ doctorName, doctorEmail, doctorPassword, doctorRole });

    try {
        const response = await fetch('http://localhost:3000/api/user/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: doctorName, 
                email: doctorEmail, 
                password: doctorPassword, 
                confirmPassword: doctorPassword,
                role: doctorRole 
            })
        });

        const result = await response.json();

        if (response.ok) { 
            alert('Doctor created successfully!'); 
            document.getElementById('doctorName').value = '';
            document.getElementById('doctorEmail').value = '';
            document.getElementById('doctorPassword').value = '';
        } else {
            alert(result.message || 'Creation failed. Please try again.'); 
        }
    } catch (error) {
        console.error('Creation error:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const submitDoctorButton = document.getElementById('submitDoctor');
    if (submitDoctorButton) {
        submitDoctorButton.addEventListener('click', async (event) => {
            event.preventDefault(); 
            submitDoctorButton.disabled = true; 
            await createDoctor();
            submitDoctorButton.disabled = false; 
        });
    }
});

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


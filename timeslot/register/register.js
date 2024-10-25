const showModal = (message) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerText = message;

    // Append the modal to the body
    document.body.appendChild(modal);

    // Automatically close the modal after 3 seconds
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 3000);
};

const registerUser = async () => {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic Frontend Validation
    if (!username || !email || !password || !confirmPassword) {
        showModal('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        showModal('Passwords do not match.');
        return;
    }

    // Optional: Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showModal('Please enter a valid email address.');
        return;
    }

    // Log the data before sending
    console.log({ username, email, password }); 

    try {
        const response = await fetch('http://localhost:3000/api/user/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }) 
        });

        const result = await response.json();

        if (response.ok) { // Use response.ok for checking success
            window.location.href = "/timeslot/frontend/login.html"; 
        } else {
            // Show specific error message from server
            showModal(result.message || 'Registration failed. Please try again.'); 
        }
    } catch (error) {
        showModal('An error occurred. Please try again later.');
        console.error('Registration error:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            registerUser();
        });
    }
});

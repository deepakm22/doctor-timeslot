const showModal = (message) => {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'block';
};

const registerUser = async () => {
    const username = document.getElementById('registerUsername').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value; 

    if (!username || !email || !password || !confirmPassword) {
        showModal('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        showModal('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/user/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();

        if (response.status === 201) {
            window.location.href = "/timeslot/frontend/login/login.html"; 
        } else {
            showModal(result.message); 
        }
    } catch (error) {
        showModal('An error occurred. Please try again later.');
        console.error('Registration error:', error);
    }
};

document.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === document.getElementById('modalClose')) {
        modal.style.display = 'none';
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
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

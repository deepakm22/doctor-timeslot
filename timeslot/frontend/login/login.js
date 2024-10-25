const showModal = (message) => {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'block';
};

const loginUser = async () => {
    const email = document.getElementById('loginUsername').value; 
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showModal('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/user/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
            if (data.result.token) {
                localStorage.setItem('token', data.result.token); 
            } else {
                console.error('Token is missing from the response.');
                showModal('An error occurred. Please try again later.');
                return;
            }

            localStorage.setItem('loggedInUser', data.result.user_email);
            localStorage.setItem('loggedInUserName', data.result.username);
            console.log('Token:', data.result.token); 
            console.log('User email:', data.result.user_email);
            console.log('User is admin:', data.result.isAdmin); 

            if (data.result.role === 'doctor') {
                console.log('Redirecting to admin page.');
                window.location.href = "/timeslot/frontend/createDoc.html"; 
            } else if (data.result.isAdmin) {
                console.log('Redirecting to admin create doctor page.'); 
                window.location.href = "/timeslot/frontend/admin/admin.html"; 
            } else {
                console.log('Redirecting to user page.'); 
                window.location.href = "/timeslot/frontend/index.html"; 
            }
        } else {
            showModal(data.message || 'Login failed. Please try again.'); 
        }
    } catch (error) {
        showModal('An error occurred during login. Please try again.');
        console.error('Error during login:', error);
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
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            loginUser();
        });
    }
});

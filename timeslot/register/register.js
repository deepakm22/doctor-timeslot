const registerUser = () => {
    const username = document.getElementById('registerUsername').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !email || !password) {
        showModal('Please fill in all fields.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);

    if (userExists) {
        showModal('Email already registered.');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('loggedInUserName', username);
    localStorage.setItem('loggedInUser', email); 

    window.location.href = "/timeslot/login.html"; 
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
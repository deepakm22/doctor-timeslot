const adminEmail = "admin@gmail.com"; 
const adminPassword = "admin123"; 

const loginUser = () => {
    const email = document.getElementById('loginUsername').value; 
    const password = document.getElementById('loginPassword').value;

    if (email === adminEmail && password === adminPassword) {
        localStorage.setItem('loggedInUser', email);
        window.location.href = "/timeslot/admin.html"; 
        return; 
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(u => u.email === email && u.password === password); 

    if (user) {
        localStorage.setItem('loggedInUser', email); 
        localStorage.setItem('loggedInUserName', user.username); 
        window.location.href = "/timeslot/index.html"; 
    } else {
        alert('Invalid email or password.');
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

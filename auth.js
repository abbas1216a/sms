function register(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const course = document.getElementById('regCourse').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const address = document.getElementById('regAddress').value.trim();

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill all required fields.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const user = { name, email, phone, password, course, gender, address };
    localStorage.setItem('smsUser', JSON.stringify(user));
    alert('Registration successful. You may now login.');
    window.location = 'index.html';
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem('smsUser'));

    if (user && user.email === email && user.password === password) {
        window.location = 'dashboard.html';
    } else {
        alert('Invalid login credentials.');
    }
}

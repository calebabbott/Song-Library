import supabase from './index.js'; // Adjust the import path as needed
let loginError = document.getElementById('login-error');

document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Error logging in:', error.message);
        loginError.innerHTML = `
        <p>${error.message}</p>`

        
    } else {
        console.log('Login successful:', data);
        // Redirect to index.html upon successful login
        window.location.href = 'mychurch.html'; // Adjust the path as needed
    }
});


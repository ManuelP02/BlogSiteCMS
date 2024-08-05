document.addEventListener('DOMContentLoaded', function() {
    console.log('Login script loaded', new Date().toISOString());
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log('Form submission intercepted');

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Login successful:', data);
                    alert(data.message);
                    console.log('Redirecting to:', data.redirectUrl || '/home');
                    window.location.href = data.redirectUrl || '/home';
                  } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('d-none');
            }
        });
    } else {
        console.error('Login form not found');
    }
});
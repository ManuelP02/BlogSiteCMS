document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup script loaded', new Date().toISOString());
    const form = document.getElementById('signup-form');
    const errorMessageElement = document.getElementById('error-message');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submission intercepted');

            const formData = new FormData(form);
            const userData = Object.fromEntries(formData);
            const submitButton = form.querySelector('button[type="submit"]');

            try {
                submitButton.disabled = true;
                errorMessageElement.classList.add('d-none');

                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('User created', data.message);
                    alert('Account created successfully! Redirecting to home page...');
                    setTimeout(() => {
                        window.location.href = data.redirectUrl || '/home';
                    }, 100);
                } else {
                    throw new Error(data.error || 'Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                errorMessageElement.textContent = error.message;
                errorMessageElement.classList.remove('d-none');
                
                // Specific handling for username already exists
                if (error.message === 'Username already exists') {
                    const usernameInput = document.getElementById('username');
                    usernameInput.classList.add('is-invalid');
                    usernameInput.focus();
                }
            } finally {
                submitButton.disabled = false;
            }
        });
    } else {
        console.error('Signup form not found');
    }
});
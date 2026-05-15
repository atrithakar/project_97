document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    
    // Selection of error display divs (IDs must match your HTML exactly)
    const errors = {
        firstname: document.getElementById('fnameErr'),
        lastname: document.getElementById('lnameErr'),
        username: document.getElementById('unameErr'),
        email: document.getElementById('emailErr'),
        password: document.getElementById('passwordErr') // Matched to your HTML
    };

    form.addEventListener('submit', (e) => {
        // Reset previous errors
        Object.values(errors).forEach(el => {
            if (el) el.textContent = '';
        });
        
        let isValid = true;

        // 1. Extract values
        const data = {
            email: form.email.value.trim(),
            password: form.password.value 
        };


        // 5. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email.length > 255) {
            errors.email.textContent = "Email is too long.";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errors.email.textContent = "Enter a valid email address.";
            isValid = false;
        }

        if (!data.password.trim().length) {
            errors.password.textContent = "Please type a password";
            isValid = false;
        }

        // 7. Block submission if any check failed
        if (!isValid) {
            e.preventDefault();
            console.warn("Project 97: Form blocked due to validation errors.");
        }
    });
});
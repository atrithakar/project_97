document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    
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
            firstname: form.firstname.value.trim(),
            lastname: form.lastname.value.trim(),
            username: form.username.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value 
        };

        // 2. First Name Validation
        if (data.firstname.length < 2 || data.firstname.length > 50) {
            errors.firstname.textContent = "First name: 2-50 characters required.";
            isValid = false;
        }

        // 3. Last Name Validation
        if (data.lastname.length < 2 || data.lastname.length > 50) {
            errors.lastname.textContent = "Last name: 2-50 characters required.";
            isValid = false;
        }

        // 4. Username Validation
        const usernameRegex = /^[a-z0-9._]+$/;
        if (data.username.length < 3 || data.username.length > 30) {
            errors.username.textContent = "Username: 3-30 characters required.";
            isValid = false;
        } else if (!usernameRegex.test(data.username)) {
            errors.username.textContent = "Use only lowercase, numbers, dots, or underscores.";
            isValid = false;
        }

        // 5. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email.length > 255) {
            errors.email.textContent = "Email is too long.";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errors.email.textContent = "Enter a valid email address.";
            isValid = false;
        }

        // 6. Password Validation
        const hasUpper = /[A-Z]/;
        const hasNumber = /[0-9]/;
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

        if (data.password.length < 8) {
            errors.password.textContent = "Minimum 8 characters.";
            isValid = false;
        } else if (!hasUpper.test(data.password)) {
            errors.password.textContent = "Include at least one uppercase letter.";
            isValid = false;
        } else if (!hasNumber.test(data.password)) {
            errors.password.textContent = "Include at least one number.";
            isValid = false;
        } else if (!hasSpecial.test(data.password)) {
            errors.password.textContent = "Include at least one special character.";
            isValid = false;
        }

        // 7. Block submission if any check failed
        if (!isValid) {
            e.preventDefault();
            console.warn("Project 97: Form blocked due to validation errors.");
        }
    });
});
async function handleLogout(req, res) {
    try {
        res.clearCookie('token')
        res.redirect('/login')
    } catch (err) {
        console.log(err);
        res.status(500).render('err', { err: 'Internal Server Error' })
    }
}

async function sendHomePage(req, res) {
    try {
        res.status(200).render('home')
    } catch (err) {
        console.log(err);
        res.status(500).render('err', { err: 'Internal Server Error' })
    }
}

async function handleLogin(req, res) {
    try {

        const email = (req.body.email || '').trim();
        const password = req.body.password || ''; // Do NOT trim passwords

        let errors = {};

        // 5. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 255) {
            errors.emailErr = "Email is too long.";
        } else if (!emailRegex.test(email)) {
            errors.emailErr = "Enter a valid email address.";
        }


        if (!password.trim().length) {
            errors.passwordErr = "Please enter a password";
        }

        // 7. Check for Validation Failures
        if (Object.keys(errors).length > 0) {
            // Block execution, return a 400 Bad Request, and render the EJS with the error variables
            return res.status(400).render('login', {
                ...errors,
                // We pass the submitted data back so the user doesn't have to retype everything
                oldData: { email }
            });
        }

        const storedPwd = await fetchPasswordHash(email)

        if (!storedPwd || !storedPwd.length) {
            return res.status(401).render('login', { passwordErr: 'Invalid Credentials', oldData: { email } })
        }

        const passwordMatched = await bcrypt.compare(password, storedPwd[0]['user_password_hash'])

        if (!passwordMatched) {
            return res.status(401).render('login', { passwordErr: 'Invalid Credentials', oldData: { email } })
        }

        const payload = {
            email: email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,              // Prevents XSS attacks
            secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
            sameSite: 'strict'           // Prevents CSRF attacks
        });
        res.redirect('/home')
    } catch (err) {
        console.log(err);
        res.status(500).render('err', { err: 'Internal Server Error' })
    }
}

async function sendLoginPage(req, res) {
    try {
        res.status(200).render('login')
    } catch (err) {
        console.log(err);
        res.status(500).render('err', { err: 'Internal Server Error' })
    }
}

async function handleSignup(req, res) {
    try {
        // 1. Safe Extraction: Prevent crashes from missing payload fields
        const firstname = (req.body.firstname || '').trim();
        const lastname = (req.body.lastname || '').trim();
        const username = (req.body.username || '').trim();
        const email = (req.body.email || '').trim();
        const password = req.body.password || ''; // Do NOT trim passwords

        let errors = {};

        // 2. First Name Validation
        if (firstname.length < 2 || firstname.length > 50) {
            errors.fnameErr = "First name: 2-50 characters required.";
        }

        // 3. Last Name Validation
        if (lastname.length < 2 || lastname.length > 50) {
            errors.lnameErr = "Last name: 2-50 characters required.";
        }

        // 4. Username Validation
        const usernameRegex = /^[a-z0-9._]+$/;
        if (username.length < 3 || username.length > 30) {
            errors.unameErr = "Username: 3-30 characters required.";
        } else if (!usernameRegex.test(username)) {
            errors.unameErr = "Use only lowercase, numbers, dots, or underscores.";
        }

        // 5. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 255) {
            errors.emailErr = "Email is too long.";
        } else if (!emailRegex.test(email)) {
            errors.emailErr = "Enter a valid email address.";
        }

        // 6. Password Validation
        const hasUpper = /[A-Z]/;
        const hasNumber = /[0-9]/;
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < 8) {
            errors.passwordErr = "Minimum 8 characters.";
        } else if (!hasUpper.test(password)) {
            errors.passwordErr = "Include at least one uppercase letter.";
        } else if (!hasNumber.test(password)) {
            errors.passwordErr = "Include at least one number.";
        } else if (!hasSpecial.test(password)) {
            errors.passwordErr = "Include at least one special character.";
        }

        // 7. Check for Validation Failures
        if (Object.keys(errors).length > 0) {
            // Block execution, return a 400 Bad Request, and render the EJS with the error variables
            return res.status(400).render('register', {
                ...errors,
                // We pass the submitted data back so the user doesn't have to retype everything
                oldData: { firstname, lastname, username, email }
            });
        }

        // --- VALIDATION PASSED ---
        // Your database insertion logic (bcrypt hashing, UUID generation, MySQL INSERT) goes here.

        const data = {
            id: uuidv4(),
            first_name: firstname,
            last_name: lastname,
            username: username,
            email: email,
            user_password_hash: await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
        }

        const userInsRes = await insertUserInDB(data);

        if (userInsRes.affectedRows != 1) {
            return res.status(500).render('err', { err: 'Internal Server Error' })
        }

        res.redirect('/login');

    } catch (err) {
        // Intercept the MySQL Duplicate Entry Error
        if (err.code === 'ER_DUP_ENTRY') {

            // Parse the error message to see if they triggered the username or email constraint
            if (err.sqlMessage.includes('users.username')) {
                return res.status(400).render('register', {
                    unameErr: "That username is already taken.",
                    oldData: req.body
                });
            }

            if (err.sqlMessage.includes('users.email')) {
                return res.status(400).render('register', {
                    emailErr: "An account with this email already exists.",
                    oldData: req.body
                });
            }
        }

        // If it's a different database error, log it and throw a 500
        console.error("[DATABASE ERROR]:", err);
        res.status(500).render('err', { err: "Internal Server Error" });
    }
}

async function sendSignupPage(req, res) {
    try {
        res.status(200).render('register')
    } catch (err) {
        console.log(err)
        res.status(500).render('err', { err: "Internal Server Error" })
    }
}

module.exports = { handleLogout, sendHomePage, handleLogin, sendLoginPage, handleSignup, sendSignupPage }
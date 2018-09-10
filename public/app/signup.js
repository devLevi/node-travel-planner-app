setupSignupEventHandlers();

function setupSignupEventHandlers() {
    $('.main-area').on('click', '.nav-signup', handleSignUpButton);
    $('.main-area').on('submit', '.signup', handleSignupAuth);
}

function displaySignupPage() {
    const signupPage = renderSignupPage();
    $('.landing-page').prop('hidden', true);
    $('#main-page').html(signupPage);
}

function renderSignupPage() {
    return `
    <section class="signup-page-screen" aria-live="assertive">
    <form role="form" class="signup">
        <fieldset name="signup-info">
            <div class="login-header">
                <legend>Sign Up</legend>
            </div>
            <p id='notification'></p>
            <div class="input-field-container">
                <label for="email" required>Email</label>
                <br>
                <input type="email" name="email" id="email" placeholder="Email address" required="">
            </div>
            <div class="input-field-container">
                <label for="password" required>Password</label>
                <br> 
                <input type="password" name="password" id="password" placeholder="Password" required>
            </div>
            <div class="input-field-container">
                <label for="password-confirm" required>Confirm password</label>
                <br>
                <input type="password" name="password" id="password-confirm" placeholder="Confirm password" required>
            </div>
        </fieldset>
        <button type="submit" class="js-signup-button">Sign up</button>
        <p>Already have an account? <a href="" class="nav-login">Log in</p></a>
    </form>
</section>
	`;
}

function handleSignUpButton(event) {
    console.log('SignUp button clicked');
    event.preventDefault();
    displaySignupPage();
}

function handleSignupAuth(event) {
    event.preventDefault();
    //get values from sign up form
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#password-confirm').val();

    // validate user inputs
    if (email == '') alert('Must input email');
    else if (password == '') alert('Must input password');
    else if (confirmPassword == '') alert('Must re-enter password');
    else if (password != confirmPassword) alert('Passwords do not match');
    // if valid
    else {
        // create the payload object (data sent to the api call)
        const newUserObject = {
            email: email,
            password: password
        };

        // make the api call using the payload above
        $.ajax({
            type: 'POST',
            url: '/api/users',
            dataType: 'json',
            data: JSON.stringify(newUserObject),
            contentType: 'application/json'
        })
            .done(function() {
                alert('Your account has been created, please login');
                displayLoginPage();
            })
            .fail(function(err) {
                console.error(err);
                alert(`Sign up error: ${err.responseJSON.message}`);
            });
    }
}

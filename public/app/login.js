setupLoginEventHandlers();

function setupLoginEventHandlers() {
    $('.main-area').on('click', '.nav-login', handleLoginButton);
    $('.main-area').on('submit', '.login', handleLoginAuth);
}

function displayLoginPage() {
    const loginPage = renderLoginPage();
    $('#main-page').html(loginPage);
    $('.landing-page').prop('hidden', true);
}

function renderLoginPage() {
    return `
		<section class="login-screen" aria-live="assertive">
			<form role="form" class="login">
				<fieldset name="login-info">
					<div class="login-header">
						<legend align="center">Log In</legend>
				    </div>
				          <p id='notification'></p>
					<label for="email" required>Email</label>
					<input type="email" name="email" id="email" placeholder="Email address" required="">
					<label for="password" required>Password</label>
					<input type="password" name="password" id="password" placeholder="Password" required>
				</fieldset>
				<button type="submit" class="js-login-button">Login</button>
				<p>Don't have an account? <a href="" class ="nav-signup">Sign up</a></p>
			</form>
        </section>
    `;
}

function handleLoginButton(event) {
    event.preventDefault();
    displayLoginPage();
}

function handleLoginAuth(event) {
    console.log('Authenticating User ...');
    event.preventDefault();
    // Get the inputs from the user in Log In form
    const email = $('#email').val();
    const password = $('#password').val();

    // validate the input
    if (email == '') {
        alert('Please input user name');
    } else if (password == '') {
        alert('Please input password');
    } else {
        // if the input is valid
        // create the payload object (what data we send to the api call)
        const loginUserObject = {
            email: email,
            password: password
        };
        console.log(loginUserObject);
        // displayUserDashboard([]);
        // TODO: Enable once we have API auth
        $.ajax({
            type: 'POST',
            url: '/api/auth/login',
            dataType: 'json',
            data: JSON.stringify(loginUserObject),
            contentType: 'application/json'
        })
            .done(function(data) {
                jwt = data.authToken;
                sessionStorage.setItem('authToken', jwt);
                sessionStorage.setItem('email', loginUserObject.email);
                getUserDashboard(loginUserObject.email);
            })
            .fail(function(err) {
                console.error(err);
                $('#notification').html(
                    'Login failed. Try again or click below to sign up!'
                );
            });
    }
}

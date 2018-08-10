'use strict';
let jwt;

//Authentication
function rememberLogIn() {
    $(document).ready(function() {
        if (sessionStorage.getItem('authToken')) {
            $.ajax({
                type: 'POST',
                url: '/api/auth/refresh',
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                        'authToken'
                    )}`
                },
                success: function(res) {
                    console.log(res);
                    jwt = res.authToken;
                    sessionStorage.setItem('authToken', jwt);
                    getUserDashboard(sessionStorage.getItem('username'));
                }
            });
        }
    });
}

// LOGIN PAGE
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
		</section> `;
}

function displayLoginPage() {
    const loginPage = renderLoginPage();
    $('#main-page').html(loginPage);
    $('.landing-page').prop('hidden', true);
}

function handleLoginButton() {
    $('.main-area').on('click', '.nav-login', function(event) {
        event.preventDefault();
        displayLoginPage();
    });
}

// SIGNUP PAGE

function renderSignupPage() {
    return `
	<section class="signup-page-screen" aria-live="assertive">
			<form role="form" class="signup">
				<fieldset name="signup-info">
					<div class="login-header">
						<legend>Sign Up</legend>
				    </div>
				          <p id='notification'></p>
					<label for="email" required>Email</label>
					<input type="email" name="email" id="email" placeholder="Email address" required="">
					<label for="password" required>Password</label>
					<input type="password" name="password" id="password" placeholder="Password" required>
					<label for="password-confirm" required>Confirm password</label>
					<input type="password" name="password" id="password-confirm" placeholder="Confirm password" required >
				</fieldset>
				<button type="submit" class="js-signup-button">Sign up</button>
				<p>Already have an account? <a href="" class="nav-login">Log in</p></a>
			</form>
		</section>
	`;
}

function displaySignupPage() {
    const signupPage = renderSignupPage();
    $('.landing-page').prop('hidden', true);
    $('#main-page').html(signupPage);
}

function handleSignUpButton() {
    $('.main-area').on('click', '.nav-signup', function(event) {
        console.log('SignUp button clicked');
        event.preventDefault();
        displaySignupPage();
    });
}

function handleSignUpSuccess() {
    $('.main-area').on('submit', '.signup', function(event) {
        console.log('SignUp Success');
        event.preventDefault();
        //get values from sign up form
        const username = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#password-confirm').val();

        // validate user inputs
        if (username == '') alert('Must input username');
        else if (password == '') alert('Must input password');
        else if (confirmPassword == '') alert('Must re-enter password');
        else if (password != confirmPassword) alert('Passwords do not match');
        // if valid
        else {
            // create the payload object (data sent to the api call)
            const newUserObject = {
                username: username,
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
                // if call is successful
                .done(function() {
                    alert('Your account has been created, please login');
                    displayLoginPage();
                })
                //if the call is failing
                .fail(function(err) {
                    console.error(err);
                    alert(`Sign up error: ${err.responseJSON.message}`);
                });
        }
    });
}

// USER DASHBOARD PAGE
function renderUserDashboard(countryEntries) {
    return `
	<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-countries-button">My Plans</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
		</div>
	</div>
	
	<main role="main" class="user-dashboard">
		<div class="dashboard-header">
			<h2>My trips</h2>
		</div>
		<section class='country-entries'>
			<h4>Time to plan!</h4>
			<div class="entry"><a href=""class="js-edit-entry">${
    countryEntries.length > 0
        ? 'Add a country'
        : 'Add my first country'
}</a></div>
			<ul>
			${
    countryEntries
        ? countryEntries
            .map(function(entry) {
                return ` <li><h5 class="entry-title"><a data-entryid="${
                    entry.id
                }">${entry.title}</a></h5>
      		 <p class="entry-date">${entry.seasonToGo}</p>
      		 </li>`;
            })
            .join('\n')
        : ''
}
			</ul>
		</section>	
	`;
}

function displayUserDashboard(countryEntries) {
    const userDashboard = renderUserDashboard(countryEntries);
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(userDashboard);
}

function getUserDashboard(user) {
    $.ajax({
        type: 'GET',
        url: '/api/entries',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function(result) {
            console.log(result);
            displayUserDashboard(result.entries);
        })
        .fail(function(err) {
            console.err(err);
        });
}

function handleLoginSuccess() {
    $('.main-area').on('submit', '.login', function(event) {
        console.log('Login Success');
        event.preventDefault();
        // Get the inputs from the user in Log In form
        const username = $('#email').val();
        const password = $('#password').val();

        // validate the input
        if (username == '') {
            alert('Please input user name');
        } else if (password == '') {
            alert('Please input password');
        }
        // if the input is valid
        else {
            // create the payload object (what data we send to the api call)
            const loginUserObject = {
                username: username,
                password: password
            };
            console.log(loginUserObject);
            $.ajax({
                type: 'POST',
                url: '/api/auth/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
                // if call is successfull
                .done(function(data) {
                    jwt = data.authToken;
                    sessionStorage.setItem('authToken', jwt);
                    sessionStorage.setItem(
                        'username',
                        loginUserObject.username
                    );
                    console.log(sessionStorage.getItem('authToken'));
                    console.log(jwt);
                    console.log(data);
                    console.log(loginUserObject.username);
                    getUserDashboard(loginUserObject.username);
                })
                //if call is failing
                .fail(function(err) {
                    console.error(err);
                    $('#notification').html(
                        'Login failed. Try again or click below to sign up!'
                    );
                });
        }
    });
}

// MY COUNTRIES
function handleMyCountriesButton() {
    $('.main-area').on('click', '.my-countries-button', function(event) {
        console.log('My Countries button clicked');
        event.preventDefault();
        $('.landing-page').prop('hidden', true);
        getUserDashboard();
    });
}

// ADD or EDIT ENTRY

function renderAddEditEntry(entry = null) {
    return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-countries-button">My Countries</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
		</div>
	</div>
	
	<main role="main" class="edit-country-entry">
		<div class="dashboard-header">
			<h2>Edit My Country</h2>
		</div>
		<form id="js-edit-form" ${entry ? `data-entryid="${entry.id}"` : ''}>
		<div class="save-delete">
			<button type = "submit" class="save" id="js-save-button">Save</button>
			<button class="cancel" id="js-cancel-button">Cancel</button>
		</div>
		<section class="edit-entry">
			<div class="entry-title">
				<input type="text" name="country-title" id="country-title" placeholder="Name your trip here" maxlength="100" type="text" 
				${entry ? `value="${entry.title}"` : ''} required>
			</div>
			<div class="entry-date">
				<input type="text" name="season-to-go" id="season-to-go" placeholder="List the best season to travel here"
				${entry ? `value="${entry.seasonToGo}"` : ''}>
			</div>
			<div class="entry-description">
				<input type="text" name="entry-description" id="country-description" 
				placeholder="Add a short description of the country you want to visit here..." ${
    entry ? `value="${entry.description}"` : ''
}>
            </div>
            
			<div class="currency">
				<h5>Currency information</h5>
				<input type="text" name="currency" id="entry-currency" placeholder="List the name of the currency and the conversion rate from USD here" 
				${entry ? `value="${entry.currency}"` : ''}>
			</div>
			<div class="foreign-words">
				<h5>Foreign words to know before you go</h5>
				<input type="text" name="foreign-words" id="entry-foreign-words" placeholder="Add foreign words with their pronounciation and meanings here..." 
				${entry ? `value="${entry.words}"` : ''}>
            </div>
            <div class="to-do">
            <h5>What do you want to do in this country?</h5>
            <input type="text" name="to-do" id="entry-to-do" placeholder="List the things you want to do in this country here" 
            ${entry ? `value="${entry.todo}"` : ''}>
        </div>

		</section>
		</form>	
	</main>
	`;
}

function displayAddEditEntry(entry = null) {
    console.log(entry);
    const entryEditor = renderAddEditEntry(entry);
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(entryEditor);
}

function handleAddEditButtons() {
    $('.main-area').on('click', '.js-edit-entry', function(event) {
        console.log('Add entry clicked');
        event.preventDefault();

        displayAddEditEntry();
    });
}

function handleEditButton() {
    $('.main-area').on('click', '#js-edit-button', function() {
        console.log('Edit entry clicked');
        const id = $(this).data('entryid');

        getEachEntry(id, displayAddEditEntry);
    });
}

function renderEachEntry(entry) {
    console.dir(entry);
    return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-countries-button">My Journal</a></div>
			<div class="nav-link"><a href="" class="js-edit-entry plus">&#43;</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
		</div>
		</div>
		<main role="main" class="country-entry">
		<div class="dashboard-header">
			<h2>My Countries</h2>
		</div>
		<div class="edit-delete">
			<button class="edit" id="js-edit-button" data-entryid="${
    entry.id
}">EDIT</button>
			<button class="delete" id="js-delete-button" data-entryid="${
    entry.id
}">DELETE</button>
		</div>
		<section class="each-entry">
			<div class="entry-title">
				<h5 class="entry-title">${entry.title}</h5>
			</div>
			<p class="entry-date">${entry.seasonToGo}</p>
			<div class="main-entry-description">
				<p class="p-entry" id="p-entry">${entry.description}</p>		
			</div>
			<div class="main-currency">
				<h5>Currency information</h5>
				<p class="p-entry" id="js-memory"> 
					${entry.currency}
				</p>	
			</div>
			<div class="main-foreign-words">
				<h5>Foreign words to know before you go</h5>
				<p class="p-entry">
					${entry.words}
				</p>
            </div>
            <div class="main-foreign-words">
            <h5>What do you want to do in this country?</h5>
            <p class="p-entry">
                ${entry.todo}
            </p>
        </div>
		</section>	
	</main>
	`;
}

function displayEachEntry(entry) {
    const eachEntry = renderEachEntry(entry);
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(eachEntry);
}

function getEachEntry(id, callback) {
    console.log(id);
    //countryEntriesStorage.get(displayEachEntry, id);
    $.ajax({
        type: 'GET',
        url: `/api/entries/${id}`,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function(entry) {
            callback(entry);
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function handleEntryClick() {
    $('.main-area').on('click', '.entry-title a', function() {
        console.log('Individual entry clicked');
        const id = $(this).data('entryid');

        getEachEntry(id, displayEachEntry);
    });
}

//CANCEL BUTTON
function handleCancelButton() {
    $('.main-area').on('click', '#js-cancel-button', function() {
        console.log('Cancel button clicked');
        $('.landing-page').prop('hidden', true);
        getUserDashboard();
    });
}

//DELETE button
function deleteEntry(id) {
    //countryEntriesStorage.delete(getUserDashboard, id);

    $.ajax({
        type: 'DELETE',
        url: `/api/entries/${id}`,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        //if call is succefull
        .done(function() {
            console.log('Deleting entry');
            getUserDashboard();
        })
        //if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function handleDeleteButton() {
    $('.main-area').on('click', '#js-delete-button', function() {
        console.log('Delete button clicked');
        const id = $(this).data('entryid');
        const confirmDelete = confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            deleteEntry(id);
        }
    });
}
// SAVE BUTTON

function saveEntry(newEntry) {
    console.log(JSON.stringify(newEntry));
    //countryEntriesStorage.update(getUserDashboard, newEntry);
    $.ajax({
        type: 'PUT',
        url: `/api/entries/${newEntry.id}`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newEntry),

        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function() {
            getUserDashboard();
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.error(jqXHR);
            console.error(error);
            console.error(errorThrown);
        });
}

function createEntry(title, seasonToGo, description, currency, words, todo) {
    //countryEntriesStorage.create(getUserDashboard, title, seasonToGo, description, currency,
    //	words);
    const newEntry = {
        title,
        seasonToGo,
        description,
        currency,
        words,
        todo
    };
    $.ajax({
        type: 'POST',
        url: '/api/entries',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newEntry),

        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function() {
            getUserDashboard();
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.error(jqXHR);
            console.error(error);
            console.error(errorThrown);
        });
}

function handleSaveButton() {
    $('.main-area').on('submit', '#js-edit-form', function(event) {
        console.log('Save button clicked');
        event.preventDefault();
        let title = $('#country-title').val();
        let seasonToGo = $('#travel-date').val();
        let description = $('#country-description').val();
        let currency = $('#entry-currency').val();
        let words = $('#entry-foreign-words').val();
        let todo = $('#entry-to-do').val();

        if ($(this).data('entryid') === undefined) {
            createEntry(title, seasonToGo, description, currency, words, todo);
        } else {
            const id = $(this).data('entryid');

            const newEntry = {
                id,
                title,
                seasonToGo,
                description,
                currency,
                words,
                todo
            };
            saveEntry(newEntry);
        }
    });
}

// LOGOUT BUTTON
function handleLogOutButton() {
    $('.main-area').on('click', '.js-logout-button', function(event) {
        event.preventDefault();
        console.log('Logged out!');
        jwt = null;
        sessionStorage.clear();
        location.reload();
    });
}

// SET UP HOME button
function handleHomeButton() {
    $('.home-button').on('click', function() {
        //displayUserDashboard()
        location.reload();
    });
}

function setUpEventHandlers() {
    handleLoginButton();
    handleSignUpButton();
    handleLoginSuccess();
    handleMyCountriesButton();
    handleAddEditButtons();
    handleSignUpSuccess();
    handleEntryClick();
    handleEditButton();
    handleCancelButton();
    handleDeleteButton();
    handleSaveButton();
    handleLogOutButton();
    handleHomeButton();
    rememberLogIn();
}

$(setUpEventHandlers);

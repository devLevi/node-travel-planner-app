// UTILS.js
function getJWTFromStorage() {
    return sessionStorage.getItem('authToken');
}

/**
 * RENDER.js
 */
// Render Functions
function renderLoginView() {
    const loginPage = getLoginTemplate();
    $('#main-page').html(loginPage);
    $('.landing-page').prop('hidden', true);
}

function renderSignupView() {
    const signupPage = getSignupTemplate();
    $('.landing-page').prop('hidden', true);
    $('#main-page').html(signupPage);
}

function renderDashboardView(httpData) {
    if (typeof httpData !== 'object') {
        console.error(
            'renderDashboard: argument "httpData" is undefined. This is probably because you called renderDashboardView directly instead of calling httpGetPlans first and letting that pass in the "httpData" argument.'
        );
    }

    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(getUserDashboardTemplate(httpData.plans));
}

function renderAddPlanView() {
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(getAddPlanTemplate());
}

// TODO: Add renderEditPlanView and getRenderPlanTemplate functions.

// Template Functions
function renderEditPlanView() {
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(getRenderPlanTemplate());
}

function getRenderPlanTemplate() {}

function getUserDashboardTemplate(plans = []) {
    let plansHtml;
    if (plans.length > 0) {
        plansHtml = plans.map(
            plan => `
            <h1>${plan.title}</h1>
        `
        );
    } else {
        plansHtml = `
            <h4>Time to plan!</h4>
        `;
    }
    return `
        <div class="nav-bar">
            <div class="nav-1">
                <div class="nav-link"><a href="" class="js-show-dashboard">My Countries</a></div>
                <div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
            </div>
        </div>
	
        <main role="main" class="user-dashboard">
            <div class="dashboard-header">
                <h2>My trips</h2>
            </div>
            <section class='country-plans'>
                ${plansHtml}
                <div class="plan">
                    <a href=""class="js-add-plan">Add a country</a>
                </div>
            </section>
        </main>
    `;
}

function getAddPlanTemplate() {
    return `
		<div class="nav-bar">
            <div class="nav-1">
                <div class="nav-link"><a href="" class="js-show-dashboard">My Countries</a></div>
                <div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
            </div>
        </div>
        
        <main role="main" class="add-country-plan">
            <div class="dashboard-header">
                <h2>Add New Country</h2>
            </div>
            <form id="js-add-plan-form" data-planid="">
            <div class="save-delete">
                <button type = "submit" class="save" id="js-save-button">Save</button>
                <button class="cancel" id="js-cancel-button">Cancel</button>
            </div>
            <section class="add-plan">
                <div class="plan-title">
                <h5>Where are you going?</h5>
                    <input type="text" name="country-title" id="country-title" placeholder="Name your trip here" maxlength="100" type="text" required>
                </div>
                <div class="plan-date">
                    <h5>Season to go</h5>
                    <input type="text" name="season-to-go" id="season-to-go" placeholder="List the best season to travel here" required>
                </div>
                <div class="plan-description">
                    <h5>Plan description</h5>
                    <input type="text" name="plan-description" id="country-description" 
                    placeholder="Add a short description of the country you want to visit here..." required>
                </div>
                <div class="currency">
                    <h5>Currency information</h5>
                    <input type="text" name="currency" id="plan-currency" placeholder="List the name of the currency and the conversion rate from USD here">
                </div>
                <div class="foreign-words">
                    <h5>Foreign words to know before you go</h5>
                    <input type="text" name="foreign-words" id="plan-foreign-words" placeholder="Add foreign words with their pronounciation and meanings here...">
                </div>
                <div class="to-do">
                <h5>What do you want to do in this country?</h5>
                <input type="text" name="to-do" id="plan-to-do" placeholder="List the things you want to do in this country here">
                </div>
            </section>
            </form>	
        </main>
	`;
}

function getLoginTemplate() {
    return `
        <section class="login-screen" aria-live="assertive">
            <form role="form" class="login">
                <fieldset name="login-info">
                    <div class="login-header">
                        <legend align="left">Log In</legend>
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
                </fieldset>
                <button type="submit" class="js-login-button">Login</button>
                <p>Don't have an account? <a href="" class="nav-signup">Sign up</a></p>
            </form>
        </section>
    `;
}

function getSignupTemplate() {
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

/**
 * HTTP.js
 */
function httpLogin(loginUserObject, callback) {
    // Check all required function arguments are provided
    if (typeof loginUserObject !== 'object') {
        throw new Error(
            'httpLogin: "loginUserObject" argument is not of type "object"'
        );
    }
    if (typeof callback !== 'function') {
        throw new Error(
            'httpLogin: "callback" argument is not of type "function"'
        );
    }

    $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        dataType: 'json',
        data: JSON.stringify(loginUserObject),
        contentType: 'application/json'
    })
        .done(function(data) {
            sessionStorage.setItem('authToken', data.authToken);
            sessionStorage.setItem('email', loginUserObject.username);
            callback(data);
        })
        .fail(function(err) {
            console.error(err);
            $('#notification').html(
                'Login failed. Try again or click below to sign up!'
            );
        });
}

function httpSignup(newUserObject, callback) {
    // Check all required function arguments are provided
    if (typeof newUserObject !== 'object') {
        throw new Error(
            'httpSignup: "newUserObject" argument is not of type "object"'
        );
    }
    if (typeof callback !== 'function') {
        throw new Error(
            'httpSignup: "callback" argument is not of type "function"'
        );
    }
    $.ajax({
        type: 'POST',
        url: '/api/users',
        dataType: 'json',
        data: JSON.stringify(newUserObject),
        contentType: 'application/json'
    })
        .done(function() {
            alert('Your account has been created, please login');
            callback();
        })
        .fail(function(err) {
            console.error(err);
            alert(`Sign up error: ${err.responseJSON.message}`);
        });
}

function httpCreatePlan(planObject, jwt, callback) {
    // Check all required function arguments are provided
    if (typeof planObject !== 'object') {
        throw new Error(
            'httpCreatePlan: "planObject" argument is not of type "object"'
        );
    }
    if (typeof jwt !== 'string') {
        throw new Error(
            'httpCreatePlan: "jwt" argument is not of type "string"'
        );
    }
    if (typeof callback !== 'function') {
        throw new Error(
            'httpCreatePlan: "callback" argument is not of type "function"'
        );
    }
    const {
        title,
        seasonToGo,
        description,
        currency,
        words,
        todo
    } = planObject;
    const newPlan = {
        title,
        seasonToGo,
        description,
        currency,
        words,
        todo
    };
    $.ajax({
        type: 'POST',
        url: '/api/plans',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newPlan),

        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function() {
            callback();
        })
        .fail(function(jqXHR, error, errorThrown) {
            alert('An error ocurred (see console)');
            console.error(jqXHR);
            console.error(error);
            console.error(errorThrown);
        });
}

function httpGetPlans(jwt, callback) {
    // Check all required function arguments are provided
    if (typeof jwt !== 'string') {
        throw new Error('httpGetPlans: "jwt" argument is not of type "string"');
    }
    if (typeof callback !== 'function') {
        throw new Error(
            'httpGetPlans: "callback" argument is not of type "function"'
        );
    }
    $.ajax({
        type: 'GET',
        url: '/api/plans',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function(data) {
            callback(data);
        })
        .fail(function(err) {
            console.error(err);
        });
}

setupAppEventHandlers();

function setupAppEventHandlers() {
    // Login
    $('.main-area').on('click', '.nav-login', onShowLoginViewBtnClick);
    $('.main-area').on('submit', '.login', onLoginFormSubmit);
    // Signup
    $('.main-area').on('click', '.nav-signup', onShowSignupViewBtnClick);
    $('.main-area').on('submit', '.signup', onSignupFormSubmit);
    // Dashboard
    $('.main-area').on(
        'click',
        '.js-show-dashboard',
        onShowDashboardViewBtnClick
    );
    $('.main-area').on('click', '.js-add-plan', onAddPlanBtnClick);
    $('.main-area').on('submit', '#js-add-plan-form', onAddPlanFormSubmit);
    $('.main-area').on('submit', '#js-add-plan-form', onEditPlanBtnClick);
    $('.main-area').on('click', '#js-cancel-button', onCancelBtnClick);
    $('.main-area').on('click', '.js-logout-button', onLogoutBtnClick);

    // Skip login and jump to dashboard if logged in.
    const authToken = getJWTFromStorage();
    if (typeof authToken === 'string') {
        httpGetPlans(getJWTFromStorage(), renderDashboardView);
    }
}

// EVENT HANDLERS

// event handlers that show views
function onShowLoginViewBtnClick(event) {
    event.preventDefault();
    renderLoginView();
}

function onShowSignupViewBtnClick(event) {
    event.preventDefault();
    renderSignupView();
}

function onShowDashboardViewBtnClick(event) {
    event.preventDefault();
    $('.landing-page').prop('hidden', true);
    httpGetPlans(getJWTFromStorage(), renderDashboardView);
}

function onAddPlanBtnClick(event) {
    event.preventDefault();
    renderAddPlanView();
}

function onEditPlanBtnClick(event) {
    event.preventDefault();
    renderEditPlanView();
}

function onCancelBtnClick() {
    $('.landing-page').prop('hidden', true);
    renderDashboardView();
}

function onLogoutBtnClick(event) {
    event.preventDefault();
    alert('Logging out...');
    sessionStorage.clear();
    location.reload();
}

// event handlers that handle form actions
function onLoginFormSubmit(event) {
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
            username: email,
            password: password
        };
        httpLogin(loginUserObject, data => {
            httpGetPlans(getJWTFromStorage(), renderDashboardView);
        });
    }
}

function onSignupFormSubmit(event) {
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
        httpSignup(newUserObject, renderLoginView);
    }
}

function onAddPlanFormSubmit(event) {
    event.preventDefault();
    let title = $('#country-title').val();
    let seasonToGo = $('#season-to-go').val();
    let description = $('#country-description').val();
    let currency = $('#plan-currency').val();
    let words = $('#plan-foreign-words').val();
    let todo = $('#plan-to-do').val();

    httpCreatePlan(
        {
            title,
            seasonToGo,
            description,
            currency,
            words,
            todo
        },
        getJWTFromStorage(),
        () => {
            httpGetPlans(getJWTFromStorage(), renderDashboardView);
        }
    );
}

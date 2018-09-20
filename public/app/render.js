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

function renderEditPlanView(httpData) {
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(getRenderPlanTemplate(httpData.plans[0]));
}

function getRenderPlanTemplate(plan) {
    return `
    <div class="nav-bar">
    <ul class="nav-1">
        <li class="nav-link home-icon"><a href=""><i class="fa fa-home"></i></a></li>
        <li class="nav-link"><a href="" class="js-show-dashboard">My Trips</a></li>
        <li class="nav-link"><a href="" id="js-logout-button">Log Out</a></li>
    </ul>
</div>

<main role="main" class="edit-country-plan">
    <div class="dashboard-header">
        <h2>Edit Trip</h2>
    </div>
    <form id="js-edit-plan-form" data-plan-id="${plan.id}">
        <section class="edit-plan">
            <div class="plan-title">
                <h5>Country</h5>
                <input type="text" name="country-title" id="country-title" value=" ${
    plan.title
}" maxlength="100"
                    type="text" required>
            </div>
            <div class="plan-date">
                <h5>Season to go</h5>
                <input type="text" name="season-to-go" id="season-to-go" value="${
    plan.seasonToGo
}" required>
            </div>
            <div class="plan-description">
                <h5>Plan description</h5>
                <input type="text" name="plan-description" id="country-description" value="${
    plan.description
}"
                    required>
            </div>
            <div class="currency">
                <h5>Currency information</h5>
                <input type="text" name="currency" id="plan-currency" value="${
    plan.currency
}">
            </div>
            <div class="foreign-words">
                <h5>Foreign words</h5>
                <input type="text" name="foreign-words" id="plan-foreign-words" value="${
    plan.words
}">
            </div>
            <div class="to-do">
                <h5>Things to do</h5>
                <input type="text" name="to-do" id="plan-to-do" value="${
    plan.todo
}">
            </div>
        </section>
        <br>
        <div class="save-cancel">
            <button type="submit" class="save" id="js-save-button">Save</button>
            <button class="cancel" id="js-cancel-button">Cancel</button>
        </div>
    </form>
</main>
`;
}

function getUserDashboardTemplate(plans = []) {
    let plansHtml;
    if (plans.length > 0) {
        plansHtml = plans.map(
            plan => `
            <h1 class="plans-title">${plan.title} </h1> 
            <button type=button id="js-edit-button" data-plan-id="${
    plan.id
}">View</button>
<br>
<button type="button" id="js-delete-button" data-plan-id="${
    plan.id
}">Delete</button> 
            `
        );
    } else {
        plansHtml = `
            <h4>Time to plan!</h4>
        `;
    }
    return `
        <div class="nav-bar">
            <ul class="nav-1">
                <li class="nav-link home-icon"><a href=""><i class="fa fa-home"></i></a></li>
                <li class="nav-link"><a href="" class="js-show-dashboard">My Trips</a></li>
                <li class="nav-link"><a href="" id="js-logout-button">Log Out</a></li>
                <li class="plan"><a href=""id="js-add-plan">Add Trip</a></li>
            </ul>
        </div>
	
        <main role="main" class="user-dashboard">
            <div class="dashboard-header">
                <h2 class="trips-title">My Trips</h2>
            </div>
            <section class='country-plans'>
                ${plansHtml.join('')}
            </section>
        </main>
    `;
}

function getAddPlanTemplate() {
    return `
		<div class="nav-bar">
            <ul class="nav-1">
                <li class="nav-link home-icon"><a href=""><i class="fa fa-home"></i></a></li>
                <li class="nav-link"><a href="" class="js-show-dashboard">My Trips</a></li>
                <li class="nav-link"><a href="" id="js-logout-button">Log Out</a></li>
            </ul>
        </div>
        
        <main role="main" class="add-country-plan">
            <div class="dashboard-header">
                <h2>Add New Trip</h2>
            </div>
            <form id="js-add-plan-form" data-planid="">
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
                    <input type="text" name="currency" id="plan-currency" placeholder="List the name of the currency and the conversion rate from USD here" required>
                </div>
                <div class="foreign-words">
                    <h5>Foreign words to know before you go</h5>
                    <input type="text" name="foreign-words" id="plan-foreign-words" placeholder="Add foreign words with their pronounciation and meanings here..." required>
                </div>
                <div class="to-do">
                <h5>What do you want to do in this country?</h5>
                <input type="text" name="to-do" id="plan-to-do" placeholder="List the things you want to do in this country here" required>
                </div>
            </section>
            <br>
            <div class="save-cancel">
                <button type = "submit" class="save" id="js-save-button">Save</button>
                <button class="cancel" id="js-cancel-button">Cancel</button>
            </div>
            </form>	
        </main>
	`;
}

function getLoginTemplate() {
    return `
        <section class="login-screen" aria-live="assertive">
            <form role="form" id="login">
                <fieldset name="login-info">
                    <div class="login-header">
                        <legend align="left">Log In</legend>
                    </div>
                    <p id='notification'></p>
                    <div class="input-field-container">
                        <label for="email" required>Email</label>
                        <br>    
                        <input type="email" name="email" id="email" required="">
                    </div>
                    <div class="input-field-container">
                        <label for="password" required>Password</label>
                        <br>
                        <input type="password" name="password" id="password" required>
                    </div>
                </fieldset>
                <br>
                <button type="submit" class="js-login-button">Login</button>
                <p>Don't have an account? <a href="" id="nav-signup">Sign up</a></p>
            </form>
        </section>
    `;
}

function getSignupTemplate() {
    return `
    <section class="signup-page-screen" aria-live="assertive">
    <form role="form" id="signup">
        <fieldset name="signup-info">
            <div class="login-header">
                <legend>Sign Up</legend>
            </div>
            <p id='notification'></p>
            <div class="input-field-container">
                <label for="email" required>Email</label>
                <br>
                <input type="email" name="email" id="email" required>
            </div>
            <div class="input-field-container">
                <label for="password" required>Password</label>
                <br>
                <input type="password" name="password" id="password" required>
            </div>
            <div class="input-field-container">
                <label for="password-confirm" required>Confirm Password</label>
                <br>
                <input type="password" name="password" id="password-confirm" required>
            </div>
        </fieldset>
        <br>
        <button type="submit" class="js-signup-button">Sign up</button>
        <p>Already have an account? <a href="" id="nav-login">Log in</p></a>
    </form>
</section>
	`;
}

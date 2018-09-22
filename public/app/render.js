function renderLoginView() {
    const loginPage = getLoginTemplate();
    $('#main-page').html(loginPage);
}

function renderSignupView() {
    const signupPage = getSignupTemplate();
    $('#main-page').html(signupPage);
}

function renderDashboardView(httpData) {
    if (typeof httpData !== 'object') {
        console.error(
            'renderDashboard: argument "httpData" is undefined. This is probably because you called renderDashboardView directly instead of calling httpGetPlans first and letting that pass in the "httpData" argument.'
        );
    }
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(getUserDashboardTemplate(httpData.plans));
}

function renderAddPlanView() {
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(getAddPlanTemplate());
}

function renderEditPlanView(httpData) {
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
        <h2>Trip Details</h2>
    </div>
    <form id="js-edit-plan-form" data-plan-id="${plan.id}">
        <section class="edit-plan">
            <div class="plan-title">
                <h5 class="input-title-header">Country</h5>
                <textarea col="100" rows="8" name="country-title" id="country-title" value=" ${
    plan.title
}" maxlength="100"
                    type="text" required>${plan.title}</textarea>
            </div>
            <div class="plan-date">
                <h5 class="input-title-header">Season to go</h5>
                <textarea col="100" rows="8" name="season-to-go" id="season-to-go" value="${
    plan.seasonToGo
}" required>${plan.seasonToGo}</textarea>
            </div>
            <div class="plan-description">
                <h5 class="input-title-header">Plan description</h5>
                <textarea col="100" rows="8" name="plan-description" id="plan-description" value="${
    plan.description
}"
                    required>${plan.description}</textarea>
            </div>
            <div class="currency">
                <h5 class="input-title-header">Currency information</h5>
                <textarea col="100" rows="8" name="currency" id="plan-currency" value="${
    plan.currency
}" required>${plan.currency}</textarea>
            </div>
            <div class="foreign-words">
                <h5 class="input-title-header">Foreign words</h5>
                <textarea col="100" rows="8" name="foreign-words" id="plan-foreign-words" value="${
    plan.words
}" required>${plan.words}</textarea>
            </div>
            <div class="to-do">
                <h5 class="input-title-header">Things to do</h5>
                <textarea col="100" rows="8" name="to-do" id="plan-to-do" value="${
    plan.todo
}" required>${plan.todo}</textarea>
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
            <div class="plans-container">
            <h1 class="plans-title">${plan.title} </h1> 
            <button type=button id="js-edit-button" data-plan-id="${
    plan.id
}">View</button>
<br>
<button type="button" id="js-delete-button" data-plan-id="${
    plan.id
}">Delete</button> 
</div>
            `
        );
        dashboardWithPlansHtml(plansHtml);
    } else {
        plansHtml = `
    <h4>Time to plan!</h4>
`;
        dashoboardWithoutPlansHtml(plansHtml);
    }
}

function dashboardWithPlansHtml(plansHtml) {
    `        <div class="nav-bar">
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

function dashoboardWithoutPlansHtml(plansHtml) {
    `
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
                ${plansHtml}
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
                <h5 class="input-title-header">Where are you going?</h5>
                   <textarea col="100" rows="8" name="country-title" id="country-title" placeholder="Name your trip here" maxlength="100" type="text" required>Where are you going?</textarea>
                </div>
                <div class="plan-date">
                    <h5 class="input-title-header">Season to go</h5>
                   <textarea col="100" rows="8" name="season-to-go" id="season-to-go" required>When is the best time of year to go?</textarea>
                </div>
                <div class="plan-description">
                    <h5 class="input-title-header">Plan description</h5>
                   <textarea col="100" rows="8" name="plan-description" id="country-description" required>Why do you want to go here?</textarea>
                </div>
                <div class="currency">
                    <h5 class="input-title-header">Currency information</h5>
                   <textarea col="100" rows="8" name="currency" id="plan-currency" required>Currency name and exchange rate</textarea>
                </div>
                <div class="foreign-words">
                    <h5 class="input-title-header">Foreign words to know before you go</h5>
                   <textarea col="100" rows="8" name="foreign-words" id="plan-foreign-words" required>Foreign words to know before you go</textarea>
                </div>
                <div class="to-do">
                <h5 class="input-title-header">What do you want to do in this country?</h5>
               <textarea col="100" rows="4" name="to-do" id="plan-to-do" required>What are you planning to do?</textarea>
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
                        <input type="email" name="email" id="email" value="test@test.com" required="">
                    </div>
                    <div class="input-field-container">
                        <label for="password" required>Password</label>
                        <br>
                        <input type="password" name="password" id="password" value="newpassword" required>
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
                <input type="email" name="email" id="email" value="login to test!" required>
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

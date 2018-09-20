setupAppEventHandlers();

function setupAppEventHandlers() {
    //Page Load
    $(window).on('load', onShowSignupViewPageLoad);
    // Login
    $('.main-area').on('click', '#nav-login', onShowLoginViewBtnClick);
    $('.main-area').on('submit', '#login', onLoginFormSubmit);
    // Signup
    $('.main-area').on('click', '#nav-signup', onShowSignupViewBtnClick);
    $('.main-area').on('submit', '#signup', onSignupFormSubmit);
    // Dashboard
    $('.main-area').on(
        'click',
        '.js-show-dashboard',
        onShowDashboardViewBtnClick
    );
    $('.main-area').on('click', '#js-add-plan', onAddPlanBtnClick);
    $('.main-area').on('submit', '#js-add-plan-form', onAddPlanFormSubmit);
    $('.main-area').on('click', '#js-edit-button', onEditPlanBtnClick);
    $('.main-area').on('click', '#js-delete-button', onDeletePlanBtnClick);
    $('.main-area').on('submit', '#js-edit-plan-form', onEditPlanFormSubmit);
    $('.main-area').on('click', '#js-cancel-button', onCancelBtnClick);
    $('.main-area').on('click', '#js-logout-button', onLogoutBtnClick);

    // Skip login and jump to dashboard if logged in.
    const authToken = getJWTFromStorage();
    if (typeof authToken === 'string') {
        httpGetPlans(getJWTFromStorage(), renderDashboardView);
    }
}

// event handlers that show views

function onShowSignupViewPageLoad(event) {
    event.preventDefault();
    renderSignupView();
}

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
    const planId = $(event.currentTarget).attr('data-plan-id');
    const authToken = getJWTFromStorage();
    httpGetOnePlan(planId, authToken, renderEditPlanView);
}

function onDeletePlanBtnClick(event) {
    event.preventDefault();
    const planId = $(event.currentTarget).attr('data-plan-id');
    const authToken = getJWTFromStorage();
    httpDeleteOnePlan(planId, authToken, () => {
        httpGetPlans(getJWTFromStorage(), renderDashboardView);
    });
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
    const email = $('#email').val();
    const password = $('#password').val();

    if (email == '') {
        alert('Please input user name');
    } else if (password == '') {
        alert('Please input password');
    } else {
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

function onEditPlanFormSubmit(event) {
    event.preventDefault();
    const planId = $(event.currentTarget).attr('data-plan-id');
    let title = $('#country-title').val();
    let seasonToGo = $('#season-to-go').val();
    let description = $('#country-description').val();
    let currency = $('#plan-currency').val();
    let words = $('#plan-foreign-words').val();
    let todo = $('#plan-to-do').val();
    httpUpdatePlan(
        {
            planId,
            title,
            seasonToGo,
            description,
            currency,
            words,
            todo
        },
        planId,
        getJWTFromStorage(),
        () => {
            httpGetPlans(getJWTFromStorage(), renderDashboardView);
        }
    );
}

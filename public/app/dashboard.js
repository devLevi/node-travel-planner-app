setupDashboardEventHandlers();

function setupDashboardEventHandlers() {
    $('.main-area').on(
        'click',
        '.my-countries-button',
        handleMyCountriesButton
    );
    $('.main-area').on('click', '.js-edit-plan', handleAddEditButtons);
    $('.main-area').on('click', '#js-edit-button', handleEditButton);
    $('.main-area').on('submit', '#js-edit-form', handleSaveButton);
    $('.main-area').on('click', '.plan-title a', handlePlanClick);
    $('.main-area').on('click', '#js-cancel-button', handleCancelButton);
    $('.main-area').on('click', '#js-delete-button', handleDeleteButton);
    $('.main-area').on('click', '.js-logout-button', handleLogOutButton);
    $('.home-button').on('click', handleHomeButton);
}

function handleMyCountriesButton(event) {
    event.preventDefault();
    $('.landing-page').prop('hidden', true);
    getUserDashboard();
}

function handleAddEditButtons(event) {
    event.preventDefault();
    displayAddEditPlan();
}

function handleEditButton() {
    const id = $(this).data('planid');
    getEachPlan(id, displayAddEditPlan);
}

function handleSaveButton(event) {
    event.preventDefault();
    let title = $('#country-title').val();
    let seasonToGo = $('#travel-date').val();
    let description = $('#country-description').val();
    let currency = $('#plan-currency').val();
    let words = $('#plan-foreign-words').val();
    let todo = $('#plan-to-do').val();

    if ($(this).data('planid') === undefined) {
        createPlan(title, seasonToGo, description, currency, words, todo);
    } else {
        const id = $(this).data('planid');

        const newPlan = {
            id,
            title,
            seasonToGo,
            description,
            currency,
            words,
            todo
        };
        savePlan(newPlan);
    }
}

function handlePlanClick() {
    const id = $(this).data('planid');
    getEachPlan(id, displayEachPlan);
}

function handleCancelButton() {
    $('.landing-page').prop('hidden', true);
    getUserDashboard();
}

function handleDeleteButton() {
    const id = $(this).data('planid');
    const confirmDelete = alert('Are you sure you want to delete this?');
    if (confirmDelete) {
        deletePlan(id);
    }
}

function handleLogOutButton(event) {
    event.preventDefault();
    console.log('Logged out!');
    jwt = null;
    sessionStorage.clear();
    location.reload();
}

function handleHomeButton() {
    location.reload();
}

function displayUserDashboard(countryPlans) {
    const userDashboard = renderUserDashboard(countryPlans);
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(userDashboard);
}

function getUserDashboard(user) {
    // displayUserDashboard();
    // REMOVED AND UPDATE ONCE BACKEND IS COMPLETE
    $.ajax({
        type: 'GET',
        url: '/api/plans',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function(result) {
            displayUserDashboard(result.plans);
        })
        .fail(function(err) {
            console.err(err);
        });
}

function displayAddEditPlan() {
    const planEditor = renderAddEditPlan();
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(planEditor);
}

function displayEachPlan(plan) {
    const eachPlan = renderEachPlan(plan);
    $('.landing-page').prop('hidden', true);
    $('.main-nav-bar').prop('hidden', true);
    $('.main-area').html(eachPlan);
}

function getEachPlan(id, callback) {
    console.log(id);
    // countryPlansStorage.get(displayEachPlan, id);
    $.ajax({
        type: 'GET',
        url: `/api/plans/${id}`,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        .done(function(plan) {
            callback(plan);
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function renderUserDashboard() {
    return `
	<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-countries-button">My Countries</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
		</div>
	</div>
	
	<main role="main" class="user-dashboard">
		<div class="dashboard-header">
			<h2>My trips</h2>
		</div>
		<section class='country-plans'>
			<h4>Time to plan!</h4>
            <div class="plan">
                <a href=""class="js-edit-plan">Add a country</a>
            </div>
        </section>`;
}

function renderAddEditPlan(plan = {}) {
    return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-countries-button">My Countries</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
		</div>
	</div>
	
	<main role="main" class="edit-country-plan">
		<div class="dashboard-header">
			<h2>Edit My Country</h2>
		</div>
		<form id="js-edit-form" data-planid="${plan.id}">
		<div class="save-delete">
			<button type = "submit" class="save" id="js-save-button">Save</button>
			<button class="cancel" id="js-cancel-button">Cancel</button>
		</div>
		<section class="edit-plan">
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

function renderEachPlan(plan) {
    return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-countries-button">My Journal</a></div>
			<div class="nav-link"><a href="" class="js-edit-plan plus">&#43;</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
		</div>
		</div>
		<main role="main" class="country-plan">
		<div class="dashboard-header">
			<h2>My Countries</h2>
		</div>
		<div class="edit-delete">
			<button class="edit" id="js-edit-button" data-planid="${plan.id}">EDIT</button>
			<button class="delete" id="js-delete-button" data-planid="${
    plan.id
}">DELETE</button>
		</div>
		<section class="each-plan">
			<div class="plan-title">
				<h5 class="plan-title">${plan.title}</h5>
			</div>
			<p class="plan-date">${plan.seasonToGo}</p>
			<div class="main-plan-description">
				<p class="p-plan" id="p-plan">${plan.description}</p>		
			</div>
			<div class="main-currency">
				<h5>Currency information</h5>
				<p class="p-plan" id="js-memory"> 
					${plan.currency}
				</p>	
			</div>
			<div class="main-foreign-words">
				<h5>Foreign words to know before you go</h5>
				<p class="p-plan">
					${plan.words}
				</p>
            </div>
            <div class="main-foreign-words">
            <h5>What do you want to do in this country?</h5>
            <p class="p-plan">
                ${plan.todo}
            </p>
        </div>
		</section>	
	</main>
	`;
}

//DELETE button
function deletePlan(id) {
    // countryPlansStorage.delete(getUserDashboard, id);

    $.ajax({
        type: 'DELETE',
        url: `/api/plans/${id}`,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
        //if call is succefull
        .done(function() {
            getUserDashboard();
        })
        //if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

// SAVE BUTTON

function savePlan(newPlan) {
    //countryPlansStorage.update(getUserDashboard, newPlan);
    $.ajax({
        type: 'PUT',
        url: `/api/plans/${newPlan.id}`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newPlan),
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

function createPlan(title, seasonToGo, description, currency, words, todo) {
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
            getUserDashboard();
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.error(jqXHR);
            console.error(error);
            console.error(errorThrown);
        });
}

'use strict';
let jwt;

//Authentication
// function rememberLogIn() {
//     $(document).ready(function() {
//         if (sessionStorage.getItem('authToken')) {
//             $.ajax({
//                 type: 'POST',
//                 url: '/api/auth/refresh',
//                 dataType: 'json',
//                 contentType: 'application/json',
//                 headers: {
//                     Authorization: `Bearer ${sessionStorage.getItem(
//                         'authToken'
//                     )}`
//                 },
//                 success: function(res) {
//                     console.log(res);
//                     jwt = res.authToken;
//                     sessionStorage.setItem('authToken', jwt);
//                     getUserDashboard(sessionStorage.getItem('username'));
//                 }
//             });
//         }
//     });
// }








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
    // rememberLogIn();
    // handleLoginButton();
    // handleLoginSuccess();
    // handleSignUpButton();
    // handleSignUpSuccess();
    // handleMyCountriesButton();
    // handleEditButton();
    // handleAddEditButtons();
    handleEntryClick();
    handleCancelButton();
    handleDeleteButton();
    handleSaveButton();
    handleLogOutButton();
    handleHomeButton();
}

$(setUpEventHandlers);

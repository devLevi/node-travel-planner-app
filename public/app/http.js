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

function httpGetOnePlan(planId, jwt, callback) {
    if (typeof planId !== 'string') {
        throw new Error(
            'httpGetOnePlan: "planId" argument is not of type "string"'
        );
    }
    if (typeof jwt !== 'string') {
        throw new Error(
            'httpGetOnePlan: "jwt" argument is not of type "string"'
        );
    }
    if (typeof callback !== 'function') {
        throw new Error(
            'httpGetOnePlan: "callback" argument is not of type "function"'
        );
    }
    $.ajax({
        type: 'GET',
        url: `/api/plans/${planId}`,
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

function httpUpdatePlan(planObject, planId, jwt, callback) {
    const {
        title,
        seasonToGo,
        description,
        currency,
        words,
        todo
    } = planObject;
    const editedPlan = {
        id: planId,
        title,
        seasonToGo,
        description,
        currency,
        words,
        todo
    };

    $.ajax({
        method: 'PUT',
        url: `/api/plans/${planId}`,
        data: JSON.stringify(editedPlan),
        contentType: 'application/JSON',
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

function httpDeleteOnePlan(planId, jwt, callback) {
    $.ajax({
        method: 'DELETE',
        url: `/api/plans/${planId}`,
        contentType: 'application/JSON',
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

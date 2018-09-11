// 'use strict';

// let jwt;

// setupLoginEventHandlers();

// function setupLoginEventHandlers() {
//     $('.main-area').on('click', '.nav-login', handleLoginButton);
//     $('.main-area').on('submit', '.login', handleLoginAuth);
// }

// function displayLoginPage() {
//     const loginPage = renderLoginPage();
//     $('#main-page').html(loginPage);
//     $('.landing-page').prop('hidden', true);
// }

// function renderLoginPage() {
//     return `
// <section class="login-screen" aria-live="assertive">
//     <form role="form" class="login">
//         <fieldset name="login-info">
//             <div class="login-header">
//                 <legend align="left">Log In</legend>
//             </div>
//             <p id='notification'></p>
//             <div class="input-field-container">
//                 <label for="email" required>Email</label>
//                 <br>
//                 <input type="email" name="email" id="email" placeholder="Email address" required="">
//             </div>
//             <div class="input-field-container">
//                 <label for="password" required>Password</label>
//                 <br>
//                 <input type="password" name="password" id="password" placeholder="Password" required>
//             </div>
//         </fieldset>
//         <button type="submit" class="js-login-button">Login</button>
//         <p>Don't have an account? <button type="button" class="nav-signup">Sign up</a>
//         </p>
//     </form>
// </section>
//     `;
// }

// function handleLoginButton(event) {
//     event.preventDefault();
//     displayLoginPage();
// }

// function handleLoginAuth(event) {
//     console.log('Authenticating User ...');
//     event.preventDefault();
//     // Get the inputs from the user in Log In form
//     const email = $('#email').val();
//     const password = $('#password').val();

//     // validate the input
//     if (email == '') {
//         alert('Please input user name');
//     } else if (password == '') {
//         alert('Please input password');
//     } else {
//         // if the input is valid
//         // create the payload object (what data we send to the api call)
//         const loginUserObject = {
//             username: email,
//             password: password
//         };
//         console.log(loginUserObject);
//         $.ajax({
//             type: 'POST',
//             url: '/api/auth/login',
//             dataType: 'json',
//             data: JSON.stringify(loginUserObject),
//             contentType: 'application/json'
//         })
//             .done(function(data) {
//                 jwt = data.authToken;
//                 sessionStorage.setItem('authToken', jwt);
//                 sessionStorage.setItem('email', loginUserObject.username);
//                 getUserDashboard(loginUserObject.username);
//             })
//             .fail(function(err) {
//                 console.log(err);
//                 $('#notification').html(
//                     'Login failed. Try again or click below to sign up!'
//                 );
//             });
//     }
// }

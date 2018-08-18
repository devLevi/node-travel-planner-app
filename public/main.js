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

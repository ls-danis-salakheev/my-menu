// import axios from 'axios';
//
// // set the base URL and authentication endpoint
// const auth_endpoint = ``;
//
// // set the client credentials
// const client_id = 'my-menu';
// const client_secret = 'my-menu-password';
//
// // set the user credentials
// const username = 'username';
// const password = 'pass';
//
// // set the authentication request parameters
// const data = new URLSearchParams({
//   grant_type: 'password',
//   username: username,
//   password: password,
//   scope: 'items',
//   client_id: client_id,
//   client_secret: client_secret
// });
//
// // send the authentication request
// axios.post(auth_endpoint, data)
//   .then(response => {
//     // authentication successful, extract the access token
//     const access_token = response.data.access_token;
//     console.log(`Access Token: ${access_token}`);
//   })
//   .catch(error => {
//     // authentication failed, handle the error
//     // let errorText = error.response.text();
//     console.log(error.response.data);
//   });
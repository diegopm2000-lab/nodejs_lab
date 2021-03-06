// index.js (client)

const fetch = require('node-fetch');
const https = require('https');

console.log('App (IN) --> Init\n');

const endpoint = process.env.ENDPOINT;
const ca = process.env.CA; // ca certificate
const key = process.env.KEY; // client key
const cert = process.env.CERT; // client certificate
console.log(`App (MID) --> endpoint: ${endpoint}`);

const agent = new https.Agent({
  // ca,
  key,
  cert,
})

fetch(endpoint, { agent, method: 'GET' })
  .then((result) => {
    console.log(`App (MID) --> result connection: ${JSON.stringify(result)}`);
    return result.json();
  })
  .then((jsonresponse) => {
    console.log(`App (MID) --> jsonresponse: ${JSON.stringify(jsonresponse)}`);
  })
  .catch((error) => {
    console.log(`App (ERROR) --> error.message: ${error.message}`);
    console.error(error.stack);
    return false;
  })
  .finally(() => {
    console.log('\nApp (OUT) --> End');
  });

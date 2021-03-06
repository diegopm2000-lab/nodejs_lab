// authorization.service.js

const { pathToRegexp } = require('path-to-regexp');

const log = require('../infrastructure/logger/applicationLogger.gateway');
const userRepository = require('../repositories/user/mongo.user.repository');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Authorization Service]';

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
// //////////////////////////////////////////////////////////////////////////////

async function authorize(endpointurl, username) {
  log.debug(`${MODULE_NAME}:${authorize.name} (IN) -> endpointurl: ${endpointurl}, username: ${JSON.stringify(username)}`);

  // Get the complete userInfo
  const user = await userRepository.getUserByFilter({ username }, true);

  log.debug(`${MODULE_NAME}:${authorize.name} (MID) -> user: ${JSON.stringify(user)}`);

  const userEndpoints = [];

  // TODO complejidad O(2N) --> mejorable, se puede hacer en un O(n) con una única pasada por el array y además cortar
  // la búsqueda en cuanto se haya encontrado...se puede usar combinando find y some, por ejemplo

  user.groups.forEach((group) => {
    group.roles.forEach((role) => {
      role.endpoints.forEach((endpoint) => {
        userEndpoints.push(endpoint);
      });
    });
  });

  log.debug(`${MODULE_NAME}:${authorize.name} (MID) -> userEndpoints: ${JSON.stringify(userEndpoints)}`);

  const endpointFound = userEndpoints.find((endpoint) => {
    const keys = [];
    const regexp = pathToRegexp(endpoint.urlregex, keys);
    const result = regexp.test(endpointurl);

    // TODO habría que validar tambien el metodo (GET, POST, PUT, ETC)...para eso es mejor pasar en el authorize tambien el method

    log.debug(`${MODULE_NAME}:${authorize.name} (MID) -> urlregex: ${endpoint.urlregex}, endpointurl: ${endpointurl}, result match: ${result}`);
    return result;
  });

  let result;
  if (endpointFound) {
    result = { message: 'OK' };
  } else {
    result = { message: 'NOT ALLOWED' };
  }

  log.debug(`${MODULE_NAME}:${authorize.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  authorize,
};

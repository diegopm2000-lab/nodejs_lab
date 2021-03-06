// role.service.js

const uniqid = require('uniqid');

const log = require('../infrastructure/logger/applicationLogger.gateway');
const roleRepository = require('../repositories/role/mongo.role.repository');
const endpointRepository = require('../repositories/endpoint/mongo.endpoint.repository');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Role Service]';

const ERROR_GROUP_EXISTS_WITH_SAME_NAME = 'Role exists with the same name';

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
// //////////////////////////////////////////////////////////////////////////////

async function getRoles() {
  log.debug(`${MODULE_NAME}:${getRoles.name} (IN) -> no params`);

  const result = await roleRepository.getRoles();

  log.debug(`${MODULE_NAME}:${getRoles.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function getRoleById(roleId) {
  log.debug(`${MODULE_NAME}:${getRoleById.name} (IN) -> roleId: ${roleId}`);

  const result = await roleRepository.getRoleByFilter({ id: roleId });

  log.debug(`${MODULE_NAME}:${getRoleById.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function createRole(newRoleIN) {
  log.info(`${MODULE_NAME}:${createRole.name} (IN) -> newRoleIN: ${JSON.stringify(newRoleIN)}`);

  // Check if there NOT exists a role with the same name
  const roleFound = await roleRepository.getRoleByFilter({ name: newRoleIN.name });
  log.info(`${MODULE_NAME}:${createRole.name} (MID) -> roleFound: ${JSON.stringify(roleFound)}`);
  if (roleFound) {
    log.error(`${MODULE_NAME}:${createRole.name} (ERROR) -> error: ${ERROR_GROUP_EXISTS_WITH_SAME_NAME}`);
    throw new Error(ERROR_GROUP_EXISTS_WITH_SAME_NAME);
  }

  const newRole = JSON.parse(JSON.stringify(newRoleIN));

  // Generate unique Id
  newRole.id = `role-${uniqid()}`;

  const result = await roleRepository.createRole(newRole);

  log.debug(`${MODULE_NAME}:${createRole.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function updateRole(roleId, updateRoleDataIN) {
  log.info(`${MODULE_NAME}:${updateRole.name} (IN) -> roleId: ${roleId}, updateRoleDataIN: ${JSON.stringify(updateRoleDataIN)}`);

  // Check if there NOT exists an role with the same name and distinct roleId
  const roleFound = await roleRepository.getRoleByFilter({ name: updateRoleDataIN.name, id: { $ne: roleId } });
  log.info(`${MODULE_NAME}:${createRole.name} (MID) -> roleFound: ${JSON.stringify(roleFound)}`);
  if (roleFound) {
    log.error(`${MODULE_NAME}:${createRole.name} (ERROR) -> error: ${ERROR_GROUP_EXISTS_WITH_SAME_NAME}`);
    throw new Error(ERROR_GROUP_EXISTS_WITH_SAME_NAME);
  }

  // Execute update
  const result = await roleRepository.updateRole(roleId, updateRoleDataIN);

  log.debug(`${MODULE_NAME}:${updateRole.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function deleteRole(roleId) {
  log.info(`${MODULE_NAME}:${deleteRole.name} (IN) -> roleId: ${roleId}`);

  const result = await roleRepository.deleteRole(roleId);

  log.debug(`${MODULE_NAME}:${deleteRole.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function addEndpointToRole(roleId, endpointId) {
  log.debug(`${MODULE_NAME}:${addEndpointToRole.name} (IN) -> roleId: ${roleId}, endpointId: ${endpointId}`);

  const roleFound = await roleRepository.getRoleByFilter({ id: roleId });

  // Check if role found
  if (!roleFound) {
    const errorMessage = `Role with id: ${roleId} not found in database`;
    log.error(`${MODULE_NAME}:${addEndpointToRole.name} (ERROR) -> ${errorMessage}`);
    throw new Error(errorMessage);
  }

  const endpointFound = await endpointRepository.getEndpointByFilter({ id: endpointId });

  // Check if endpoint found
  if (!endpointFound) {
    const errorMessage = `Endpoint with id: ${endpointId} not found in database`;
    log.error(`${MODULE_NAME}:${addEndpointToRole.name} (ERROR) -> ${errorMessage}`);
    throw new Error(errorMessage);
  }

  const result = await roleRepository.addEndpointToRole(roleId, endpointFound);

  log.debug(`${MODULE_NAME}:${addEndpointToRole.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function deleteEndpointFromRole(roleId, endpointId) {
  log.debug(`${MODULE_NAME}:${deleteEndpointFromRole.name} (IN) -> roleId: ${roleId}, endpointId: ${endpointId}`);

  const roleFound = await roleRepository.getRoleByFilter({ id: roleId });

  // Check if role found
  if (!roleFound) {
    const errorMessage = `Role with id: ${roleId} not found in database`;
    log.error(`${MODULE_NAME}:${addEndpointToRole.name} (ERROR) -> ${errorMessage}`);
    throw new Error(errorMessage);
  }

  const endpointFound = await endpointRepository.getEndpointByFilter({ id: endpointId });

  // Check if endpoint found
  if (!endpointFound) {
    const errorMessage = `Endpoint with id: ${endpointId} not found in database`;
    log.error(`${MODULE_NAME}:${addEndpointToRole.name} (ERROR) -> ${errorMessage}`);
    throw new Error(errorMessage);
  }

  const result = await roleRepository.deleteEndpointFromRole(roleId, endpointFound);

  log.debug(`${MODULE_NAME}:${deleteEndpointFromRole.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  addEndpointToRole,
  deleteEndpointFromRole,
};

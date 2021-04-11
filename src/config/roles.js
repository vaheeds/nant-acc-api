const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], []);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'getCategories', 'manageCategories', 'getAccounts', 'manageAccounts']);

module.exports = {
  roles,
  roleRights,
};

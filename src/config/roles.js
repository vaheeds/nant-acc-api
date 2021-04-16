const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getCategories', 'getAccounts']);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getCategories',
  'manageCategories',
  'getAccounts',
  'manageAccounts',
  'getTransactions',
  'manageTransactions',
]);

module.exports = {
  roles,
  roleRights,
};

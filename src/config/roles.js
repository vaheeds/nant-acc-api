const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getCategories', 'getAccounts', 'getTags']);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getCategories',
  'manageCategories',
  'getAccounts',
  'manageAccounts',
  'getTransactions',
  'manageTransactions',
  'getTags',
  'manageTags',
]);

module.exports = {
  roles,
  roleRights,
};

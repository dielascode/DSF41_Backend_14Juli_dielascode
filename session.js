let currentUser = null;

module.exports = {
    setUser: (user) => (currentUser = user),
    getUser: () => currentUser,
    clearUser: () => (currentUser = null),
};
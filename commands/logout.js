const readline = require('readline-sync');
const session = require('../session');

async function logout() {
    session.clearUser();
    console.log("anda sudah logout");
}
module.exports = logout;

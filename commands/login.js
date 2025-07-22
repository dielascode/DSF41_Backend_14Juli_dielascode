const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
// const login = require('./login');
const session = require('../session');

async function login() {
    console.log('Login ke akun anda terlebih dahulu, dengan nama dan pin yang anda masukkan tadi');
    const name = readline.question('Enter your name: ');
    const pin = readline.question('Enter your PIN: ', {hideEchoBack:true});

    try {
        const [result] = await db.execute(
            'SELECT * FROM accounts WHERE name=?', [name]
        );
        if (!result[0] || result[0].length === 0) {
            console.log('Gak ada akunnya');
            exit;
        }
        const user = result[0];
        console.log(result);
        const pins = await bcrypt.compare(pin, user.pin);
        if (!pins) {
            console.log('pin salah, silahkan login kembali');
            exit;
        }

        session.setUser(user);
        console.log('Selamat datang, ',name)
    } catch (error) {
        console.log('Akun tidak ditemukan, silahkan login kembali', error.message)
        exit;
    }
}

module.exports = login;
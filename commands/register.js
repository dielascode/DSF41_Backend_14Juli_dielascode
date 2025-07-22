const readline = require('readline-sync');
const db = require('../db');
const hash = require('bcrypt');
const login = require('./login');

async function register() {
    const name = readline.question('Enter your name: ');
    const pin = readline.question('Enter your PIN: ', {hideEchoBack:true});

    try {
        const hashPin = await hash.hash(pin, 10);
        const [result] = await db.execute(
            'INSERT INTO accounts (name, pin) VALUES (?, ?)', [name, hashPin]
        );
        console.log('Registration Succcess!');
        await login();
    } catch (error) {
        console.error('Registration Failed:', err.message);
    }
}

module.exports = register;
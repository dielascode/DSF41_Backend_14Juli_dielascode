const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
// const login = require('./login');
const session = require('../session');

async function balance(name) {
    const [result] = await db.execute(
        'SELECT * FROM accounts WHERE name=?', [name]
    );
    if(result[0].balance === null){
        console.log('Saldo anda kosong');
    }else{
        console.log('Saldo anda adalah: ', result[0].balance);
    }
}

module.exports = balance;

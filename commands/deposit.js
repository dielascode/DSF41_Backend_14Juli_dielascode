const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
// const login = require('./login');
const session = require('../session');

async function deposit(name) {
    const uang = readline.question('Masukkan nominal uang yang ingin ditambahkan: ');
    const [result] = await db.execute(
        'SELECT * FROM accounts WHERE name=?', [name]
    );
    let newbalance;
    const uangsekarang = result[0].balance;
    console.log('jumlah uang sekarang', uangsekarang)
    if (uangsekarang === null) {
        newbalance = parseInt(uang);
        console.log(newbalance)
    } else {
        newbalance = parseInt(uangsekarang) + parseInt(uang);
        console.log(newbalance)
    }
    const [resultnew] = await db.execute( //1 function
        'UPDATE accounts SET balance = ? WHERE name = ?', [newbalance, name]
    );
    if (!resultnew) {
        console.log('Gagal melakukan deposit');
    } else {
        console.log('Berhasil melakukan deposit');
    }
}

module.exports = deposit;

const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
// const login = require('./login');
const session = require('../session');
const balance = require('./balance');
const deposit = require('./deposit');
const transfer = require('./transfer');
const withdraw = require('./withdraw');

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
        // console.log(result);
        const pins = await bcrypt.compare(pin, user.pin);
        if (!pins) {
            console.log('pin salah, silahkan login kembali');
            exit;
        }

        session.setUser(user);
        console.log('Selamat datang, ',name)
        console.log('Apa yang ingin anda lakukan selanjutnya?')
        console.log('1. Cek saldo')
        console.log('2. Deposit')
        console.log('3. Transfer')
        console.log('4. Ambil Uang')
        console.log('5. Cek histori akun anda')
        console.log('6. Keluar')
        const number = readline.question('Masukkan anka sesuai dengan menu yang tersedia: ');
        if (number === '1') {
            await balance(name);
        }else if(number === '2'){
            await deposit(name);
        }else if(number === '3'){
            await transfer(name);
        }else if(number === '4'){
            await withdraw(name);
        }else if(number === '5'){
            // await history(name);
        }else if(number === '6'){
            // await logout
        }else{
            console.log('Menu tidak tersedia');
        }


        // console.log('Apa yang ingin anda lakukan selanjutnya?')
        // console.log('2. Deposit')
        // console.log('3. Transfer')
        // console.log('4. Cek histori akun anda')
        // console.log('5. Keluar')
        // const number = readline.question('Masukkan anka sesuai dengan menu yang tersedia: ');
    } catch (error) {
        console.log('Akun tidak ditemukan, silahkan login kembali', error.message)
        // exit;
    }
}

module.exports = login;
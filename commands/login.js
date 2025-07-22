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
        console.log('4. Cek histori akun anda')
        console.log('5. Keluar')
        const number = readline.question('Masukkan anka sesuai dengan menu yang tersedia: ');
        if (number === '1') {
            const [result] = await db.execute(
                'SELECT * FROM accounts WHERE name=?', [name]
            );
            if(result[0].balance === null){
                console.log('Saldo anda kosong');
            }else{
                console.log('Saldo anda adalah: ', result[0].balance);
            }
        }else if(number === '2'){
            const uang = readline.question('Masukkan nominal uang yang ingin ditambahkan: ');
            const [result] = await db.execute(
                'SELECT * FROM accounts WHERE name=?', [name]
            );
            let newbalance;
            const uangsekarang = result[0].balance;
            console.log('jumlah uang sekarang', uangsekarang)
            if(uangsekarang === null){
                newbalance = parseInt(uang);
                console.log(newbalance)
            }else{
                newbalance = parseInt(uangsekarang) + parseInt(uang);
                console.log(newbalance)
            }
            const [resultnew] = await db.execute( //1 function
                'UPDATE accounts SET balance = ? WHERE name = ?', [newbalance, name]
            );
            if(!resultnew){
                console.log('Gagal melakukan deposit');
            }else{
                console.log('Berhasil melakukan deposit');
            }
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
const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
// const login = require('./login');
const session = require('../session');

async function transfer(name) {
    let nama = readline.question('Masukkan nama akun tujuan: ');
    let amount = parseInt(readline.question('Masukkan jumlah uang yang akan di transfer: '));
    const [tujuan] = await db.execute(
        'SELECT * FROM accounts WHERE name = ?', [nama]
    );
    if (!tujuan[0] || tujuan[0].length === 0) {
        console.log('Gak ada akunnya');
        exit;
    }
    let [result] = await db.execute(
        'SELECT * FROM accounts WHERE name=?', [name]
    );
    if (amount > result[0].balance) {
        console.log("Saldo tidak mencukupi");
        exit;
    }else{
        let sisauang = result[0].balance - amount;
        [result] = await db.execute( //1 function
            'UPDATE accounts SET balance = ? WHERE name = ?', [sisauang, name]
        );
        let uangtujuan = tujuan[0].balance + amount;
        let [result2] = await db.execute(
            'UPDATE accounts SET balance = ? WHERE name = ?', [uangtujuan, nama]
        )
        const [result_trans] = await db.execute( //2 function
            'INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, ?, ?, ?)', [result[0].id, 'transfer', amount, tujuan[0].id]
        );
        if (!result && !result2 && !result_trans) {
            console.log('Gagal melakukan transfer');
        } else {
            console.log('Berhasil melakukan transfer');
        }
    }

    
}

module.exports = transfer;

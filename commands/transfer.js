const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
// const login = require('./login');
const session = require('../session');

async function transfer(name) {
    let nama = readline.question('Masukkan nama akun penerima: ');
    let amount = parseFloat(readline.question('Masukkan jumlah uang yang akan di transfer: '));
    let [penerima] = await db.execute(
        'SELECT * FROM accounts WHERE name = ?', [nama]
    );
    let id_penerima = penerima[0].id; //ID penerimaNYA
    if (!penerima[0] || penerima[0].length === 0) {
        console.log('Gak ada akunnya');
        exit;
    }
    console.log(penerima)
    let [pengirim] = await db.execute(
        'SELECT * FROM accounts WHERE name=?', [name]
    );
    let id_pengirim = pengirim[0].id; //ID AKUN
    if (amount > pengirim[0].balance) {
        console.log("Saldo tidak mencukupi");
        exit;
    }else{
        let sisauang = pengirim[0].balance - amount;
        [pengirim] = await db.execute( //1 function
            'UPDATE accounts SET balance = ? WHERE name = ?', [sisauang, name]
        );
        console.log('uang pengirim saat ini: ', sisauang)
        let uangpenerima = parseInt(penerima[0].balance) + amount;
        [penerima] = await db.execute(
            'UPDATE accounts SET balance = ? WHERE name = ?', [uangpenerima, nama]
        )
        console.log('uang penerima saat ini: ', uangpenerima)
        const [result_trans_pengirim] = await db.execute( //2 function
            'INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, ?, ?, ?)', [id_pengirim, 'transfer_out', amount, id_penerima]
        );
        const [result_trans_penerima] = await db.execute( //2 function
            'INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, ?, ?, ?)', [id_penerima, 'transfer_in', amount, id_pengirim]
        );
        if (!pengirim && !penerima && !result_trans_pengirim && !result_trans_penerima) {
            console.log('Gagal melakukan transfer');
        } else {
            console.log('Berhasil melakukan transfer');
        }
    }

    
}

module.exports = transfer;

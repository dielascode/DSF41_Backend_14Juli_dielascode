const readline = require('readline-sync');
const db = require('../db');

async function withdraw(name) {
    let amount = parseFloat(readline.question('Masukkan jumlah uang yang akan di ambil: '));
    let [akun] = await db.execute(
        'SELECT * FROM accounts WHERE name = ?', [name]
    );
    let id_akun = akun[0].id; //ID akunNYA
    if (!akun[0] || akun[0].length === 0) {
        console.log('Gak ada akunnya');
        exit;
    }
    if (amount > akun[0].balance) {
        console.log("Saldo tidak mencukupi");
        exit;
    }else{
        let sisauang = akun[0].balance - amount;
        [akun] = await db.execute( //1 function
            'UPDATE accounts SET balance = ? WHERE name = ?', [sisauang, name]
        );
        console.log('uang akun saat ini: ', sisauang)
        const [result_trans_akun] = await db.execute( //2 function
            'INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, ?, ?, ?)', [id_akun, 'withdraw', amount, null]
        );
        
        if (!akun && !result_trans_akun) {
            console.log('Gagal melakukan withdraw');
        } else {
            console.log('Berhasil melakukan withdraw');
        }
    }

    
}

module.exports = withdraw;

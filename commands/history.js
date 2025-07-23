const readline = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcrypt');
const session = require('../session');

async function history(name) {
    const [akun] = await db.execute(
        'SELECT * FROM accounts WHERE name=?', [name]
    );

    if (akun.length === 0) {
        console.log('Akun tidak ditemukan.');
        return;
    }

    const id_akun = akun[0].id;

    const [rows] = await db.execute(
        'SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at DESC',[id_akun]
    );

    if (rows.length === 0) {
        console.log('Belum ada transaksi.');
    } else {
        console.log(`\nRiwayat Transaksi untuk ${name}:`);
        rows.forEach((tx, index) => {
            console.log(`${index + 1}. [${tx.created_at}] ${tx.type} sebesar Rp${tx.amount}`);
        });
    }
}

module.exports = history;

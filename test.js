const db = require('./db');

(async () => {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    console.log('Koneksi berhasil! Hasil:', rows[0].result); // Harusnya muncul: 2
  } catch (err) {
    console.error('Koneksi gagal:', err.message);
  }
})();

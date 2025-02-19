const db = require('./config/db');

db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
        console.error('Koneksi database gagal:', err);
    } else {
        console.log('Koneksi database berhasil! Hasil tes:', results[0].result);
    }
    db.end(); // Tutup koneksi setelah pengecekan
});

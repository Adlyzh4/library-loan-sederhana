const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', // Jika ada password, isi di sini
    database: 'library_db',
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err);
    } else {
        console.log('Terhubung ke database MariaDB');
    }
});

module.exports = db;

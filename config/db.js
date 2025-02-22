const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '', // Gunakan dari .env jika ada
    database: process.env.DB_NAME || 'library_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Maksimal koneksi yang bisa dibuat dalam pool
    queueLimit: 0
}).promise(); // Menggunakan promise untuk query async/await

// Cek koneksi
db.getConnection()
    .then(connection => {
        console.log('✅ Terhubung ke database MariaDB');
        connection.release(); // Kembalikan koneksi ke pool
    })
    .catch(err => {
        console.error('❌ Koneksi database gagal:', err);
    });

module.exports = db;

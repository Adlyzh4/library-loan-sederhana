const express = require("express");
const router = express.Router();
const db = require("../config/db"); 

// Route untuk menampilkan Dashboard
router.get("/", async (req, res) => {
    try {
        const queries = {
            totalBooks: "SELECT COUNT(*) AS total FROM books",
            availableBooks: 'SELECT COUNT(*) AS total FROM books WHERE status = "tersedia"',
            borrowedBooks: 'SELECT COUNT(*) AS total FROM books WHERE status = "dipinjam"',
            totalLoans: "SELECT COUNT(*) AS total FROM loans",
            lateBooks: 'SELECT COUNT(*) AS total FROM loans WHERE due_date <= CURDATE() AND status = "dipinjam"',
        };

        // Jalankan semua query secara paralel
        const [totalBooks, availableBooks, borrowedBooks, totalLoans, lateBooks] = await Promise.all([
            db.query(queries.totalBooks),
            db.query(queries.availableBooks),
            db.query(queries.borrowedBooks),
            db.query(queries.totalLoans),
            db.query(queries.lateBooks),
        ]);

        // Render dashboard dengan data
        res.render("dashboard", {
            totalBooks: totalBooks[0][0].total,
            availableBooks: availableBooks[0][0].total,
            borrowedBooks: borrowedBooks[0][0].total,
            totalLoans: totalLoans[0][0].total,
            lateBooks: lateBooks[0][0].total,
        });
    } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
        res.status(500).send("Terjadi kesalahan dalam mengambil data dashboard");
    }
});

module.exports = router;

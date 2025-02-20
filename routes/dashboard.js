const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Sesuaikan dengan koneksi MySQL kamu

// Route untuk menampilkan Dashboard
router.get('/', (req, res) => {
    const queries = {
        totalBooks: 'SELECT COUNT(*) AS total FROM books',
        availableBooks: 'SELECT COUNT(*) AS total FROM books WHERE status = "tersedia"',
        borrowedBooks: 'SELECT COUNT(*) AS total FROM books WHERE status = "dipinjam"',
        totalLoans: 'SELECT COUNT(*) AS total FROM loans',
        lateBooks: 'SELECT COUNT(*) AS total FROM loans WHERE due_date <= CURDATE() AND status = "dipinjam"'
    };
    
    db.query(queries.totalBooks, (err, totalBooksResult) => {
        if (err) return res.status(500).send('Error mengambil data buku');
    
        db.query(queries.availableBooks, (err, availableBooksResult) => {
            if (err) return res.status(500).send('Error mengambil data buku tersedia');
    
            db.query(queries.borrowedBooks, (err, borrowedBooksResult) => {
                if (err) return res.status(500).send('Error mengambil data buku dipinjam');
    
                db.query(queries.totalLoans, (err, totalLoansResult) => {
                    if (err) return res.status(500).send('Error mengambil data peminjaman');
    
                    db.query(queries.lateBooks, (err, lateBooksResult) => {
                        if (err) return res.status(500).send('Error mengambil data buku terlambat');
    
                        res.render('dashboard', {
                            totalBooks: totalBooksResult[0].total,
                            availableBooks: availableBooksResult[0].total,
                            borrowedBooks: borrowedBooksResult[0].total,
                            totalLoans: totalLoansResult[0].total,
                            lateBooks: lateBooksResult[0].total
                        });
                    });
                });
            });
        });
    });    
});

module.exports = router;

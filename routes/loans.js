const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Sesuaikan dengan koneksi MySQL kamu

// Route untuk menampilkan daftar peminjaman
router.get('/', (req, res) => {
    db.query(`
        SELECT loans.id, books.title, loans.borrower_name, loans.loan_date, loans.due_date, loans.return_date, loans.status
        FROM loans
        JOIN books ON loans.book_id = books.id
    `, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data peminjaman:', err);
            return res.status(500).send('Terjadi kesalahan');
        }
        res.render('loans', { loans: results });
    });
});

// Route untuk meminjam buku
router.post('/borrow', (req, res) => {
    const { book_id, borrower_name, due_date } = req.body;
    
    // Set tanggal pinjam (hari ini)
    const loanDate = new Date();

    db.query('INSERT INTO loans (book_id, borrower_name, loan_date, due_date, status) VALUES (?, ?, ?, ?, ?)', 
        [book_id, borrower_name, loanDate, due_date, 'dipinjam'], 
        (err) => {
            if (err) {
                console.error('Gagal menambahkan peminjaman:', err);
                return res.status(500).send('Terjadi kesalahan');
            }

            // Update status buku jadi "dipinjam"
            db.query('UPDATE books SET status = "dipinjam" WHERE id = ?', [book_id], (err) => {
                if (err) {
                    console.error('Gagal memperbarui status buku:', err);
                    return res.status(500).send('Terjadi kesalahan');
                }
                res.redirect('/loans');
            });
    });
});



// Route untuk mengembalikan buku
router.post('/return/:id', (req, res) => {
    const loanId = req.params.id;

    // Ambil book_id dari data peminjaman
    db.query('SELECT book_id FROM loans WHERE id = ?', [loanId], (err, results) => {
        if (err) {
            console.error('Gagal mengambil data peminjaman:', err);
            return res.status(500).send('Terjadi kesalahan');
        }

        if (results.length === 0) {
            return res.status(404).send('Peminjaman tidak ditemukan');
        }

        const bookId = results[0].book_id;

        // Update status peminjaman menjadi "dikembalikan"
        db.query('UPDATE loans SET status = "dikembalikan", return_date = CURDATE() WHERE id = ?', [loanId], (err) => {
            if (err) {
                console.error('Gagal memperbarui status peminjaman:', err);
                return res.status(500).send('Terjadi kesalahan');
            }

            // Ubah status buku menjadi "tersedia"
            db.query('UPDATE books SET status = "tersedia" WHERE id = ?', [bookId], (err) => {
                if (err) {
                    console.error('Gagal memperbarui status buku:', err);
                    return res.status(500).send('Terjadi kesalahan');
                }
                res.redirect('/loans');
            });
        });
    });
});

//route untuk hapus buku
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM loans WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Gagal menghapus pinjaman buku');
        }
        res.redirect('/loans');
    });
});


module.exports = router;

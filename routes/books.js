const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Menampilkan daftar buku
router.get('/', (req, res) => {
    db.query(`
        SELECT books.*, loans.due_date 
        FROM books 
        LEFT JOIN loans ON books.id = loans.book_id AND loans.status = "dipinjam"
    `, (err, results) => {
        if (err) {
            console.error('Gagal mengambil daftar buku:', err);
            return res.status(500).send('Terjadi kesalahan');
        }
        res.render('books', { books: results });
    });
});


//route untuk menambahkan buku
router.post('/add', (req, res) => {
    const { title, author } = req.body;
    db.query('INSERT INTO books (title, author) VALUES (?, ?)', [title, author], (err) => {
        if (err) {
            return res.status(500).send('Gagal menambahkan buku');
        }
        res.redirect('/books?message=Buku berhasil ditambahkan&type=success');
    });
});

//route untuk mengedit buku
router.post('/edit/:id', (req, res) => {
    const { title, author } = req.body;
    const { id } = req.params;
    db.query('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, id], (err) => {
        if (err) {
            return res.status(500).send('Gagal mengedit buku');
        }
        res.redirect('/books?message=Buku berhasil diedit&type=success');
    });
});

//route untuk hapus buku
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Gagal menghapus buku');
        }
        res.redirect('/books?message=Buku berhasil dihapus&type=success');
    });
});





module.exports = router;

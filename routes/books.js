const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Menampilkan daftar buku
router.get('/', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            return res.status(500).send('Gagal mengambil data buku');
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
        res.redirect('/books');
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
        res.redirect('/books');
    });
});

//route untuk hapus buku
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Gagal menghapus buku');
        }
        res.redirect('/books');
    });
});



module.exports = router;

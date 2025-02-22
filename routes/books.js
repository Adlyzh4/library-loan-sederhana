const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Menampilkan daftar buku dengan filter pencarian
router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.search ? `%${req.query.search}%` : "%";
        const sql = `
            SELECT books.*, loans.due_date 
            FROM books 
            LEFT JOIN loans ON books.id = loans.book_id AND loans.status = "dipinjam"
            WHERE books.title LIKE ? OR books.author LIKE ?
        `;

        const [books] = await db.query(sql, [searchQuery, searchQuery]);
        res.render("books", { books, searchQuery: req.query.search || "" });
    } catch (err) {
        console.error("Gagal mengambil daftar buku:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Route untuk menambahkan buku
router.post("/add", async (req, res) => {
    const { title, author } = req.body;

    try {
        await db.query("INSERT INTO books (title, author) VALUES (?, ?)", [title, author]);
        res.redirect("/books?message=Buku berhasil ditambahkan&type=success");
    } catch (err) {
        console.error("Gagal menambahkan buku:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Route untuk mengedit buku
router.post("/edit/:id", async (req, res) => {
    const { title, author } = req.body;
    const { id } = req.params;

    try {
        const [result] = await db.query("UPDATE books SET title = ?, author = ? WHERE id = ?", [title, author, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send("Buku tidak ditemukan");
        }

        res.redirect("/books?message=Buku berhasil diedit&type=success");
    } catch (err) {
        console.error("Gagal mengedit buku:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Route untuk menghapus buku
router.post("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send("Buku tidak ditemukan");
        }

        res.redirect("/books?message=Buku berhasil dihapus&type=success");
    } catch (err) {
        console.error("Gagal menghapus buku:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

module.exports = router;

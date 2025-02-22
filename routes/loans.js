const express = require("express");
const router = express.Router();
const exceljs = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

// Route untuk menampilkan daftar peminjaman
router.get("/", async (req, res) => {
    try {
        const [loans] = await db.query(`
            SELECT loans.id, books.title, loans.borrower_name, loans.loan_date, loans.due_date, loans.return_date, loans.status
            FROM loans
            JOIN books ON loans.book_id = books.id
        `);
        res.render("loans", { loans });
    } catch (err) {
        console.error("Gagal mengambil data peminjaman:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Route untuk meminjam buku
router.post("/borrow", async (req, res) => {
    const { book_id, borrower_name, due_date } = req.body;
    const loanDate = new Date();

    try {
        await db.query("INSERT INTO loans (book_id, borrower_name, loan_date, due_date, status) VALUES (?, ?, ?, ?, ?)", 
            [book_id, borrower_name, loanDate, due_date, "dipinjam"]);

        await db.query("UPDATE books SET status = 'dipinjam' WHERE id = ?", [book_id]);

        res.redirect("/loans?message=Buku berhasil dipinjam&type=success");
    } catch (err) {
        console.error("Gagal menambahkan peminjaman:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Route untuk mengembalikan buku
router.post("/return/:id", async (req, res) => {
    const loanId = req.params.id;

    try {
        const [results] = await db.query("SELECT book_id FROM loans WHERE id = ?", [loanId]);
        if (results.length === 0) {
            return res.status(404).send("Peminjaman tidak ditemukan");
        }

        const bookId = results[0].book_id;
        await db.query("UPDATE loans SET status = 'dikembalikan', return_date = CURDATE() WHERE id = ?", [loanId]);
        await db.query("UPDATE books SET status = 'tersedia' WHERE id = ?", [bookId]);

        res.redirect("/loans?message=Buku berhasil dikembalikan&type=success");
    } catch (err) {
        console.error("Gagal memperbarui status peminjaman:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Route untuk menghapus peminjaman
router.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await db.query("DELETE FROM loans WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send("Peminjaman tidak ditemukan");
        }

        res.redirect("/loans?message=Buku berhasil dihapus&type=success");
    } catch (err) {
        console.error("Gagal menghapus peminjaman:", err);
        res.status(500).send("Terjadi kesalahan");
    }
});

// Fungsi untuk mendapatkan tanggal dalam format YYYY-MM-DD
const getFormattedDate = () => new Date().toISOString().split("T")[0];

// Route untuk mengekspor data ke Excel
router.get("/export/excel", async (req, res) => {
    try {
        const [books] = await db.query("SELECT * FROM books");
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Daftar Buku");

        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Judul Buku", key: "title", width: 30 },
            { header: "Penulis", key: "author", width: 25 },
            { header: "Status", key: "status", width: 15 },
        ];

        books.forEach(book => worksheet.addRow(book));

        const filename = `Daftar_Buku_${getFormattedDate()}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Error generating Excel file:", err);
        res.status(500).send("Gagal mengekspor data");
    }
});

// Route untuk mengekspor data ke PDF
router.get("/export/pdf", async (req, res) => {
    try {
        const [books] = await db.query("SELECT * FROM books");
        const doc = new PDFDocument({ margin: 30 });

        const filename = `Daftar_Buku_${getFormattedDate()}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/pdf");

        doc.pipe(res);
        doc.fontSize(18).text("Daftar Buku Perpustakaan", { align: "center" });
        doc.moveDown();

        books.forEach((book, index) => {
            doc.fontSize(12).text(`${index + 1}. ${book.title} - ${book.author} (${book.status})`);
        });

        doc.end();
    } catch (err) {
        console.error("Error generating PDF file:", err);
        res.status(500).send("Gagal mengekspor data");
    }
});

module.exports = router;

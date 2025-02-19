const express = require('express');
const bodyParser = require('body-parser');
const booksRoute = require('./routes/books');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/books', booksRoute);

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});

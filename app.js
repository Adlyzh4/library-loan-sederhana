const express = require('express');
const bodyParser = require('body-parser');
const booksRoute = require('./routes/books');
const loansRoute = require('./routes/loans');
const dashboardRoute = require('./routes/dashboard');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/books', booksRoute);
app.use('/loans', loansRoute);
app.use('/dashboard', dashboardRoute);

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const hotelRoutes = require('./routes/hotels.js');
const reviewRoutes = require('./routes/reviews.js');

mongoose.connect('mongodb://127.0.0.1:27017/room-reviews')
    .then(() => console.log("MongoDB Connection Established."))
    .catch(error => console.log("MongoDB Error Occured.", error));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); //set query string override
// routes
app.use('/hotels', hotelRoutes);
app.use('/hotels/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

// catch non existing url and throw ExpressError to next
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong...';
    res.status(statusCode).render('error', { err });
})

// listen to server
app.listen(3000, () => {
    console.log("Listening on Port 3000");
})
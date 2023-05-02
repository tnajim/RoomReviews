const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { hotelSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const HotelModel = require('./models/hotel');
const Review = require('./models/review');


mongoose.connect('mongodb://127.0.0.1:27017/room-reviews')
    .then(() => console.log("MongoDB Connection Established."))
    .catch(error => console.log("MongoDB Error Occured.", error));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); //set query string override

const validateHotel = (req, res, next) => {
    const { error } = hotelSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})
// index get route
app.get('/hotels', catchAsync(async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
}))
// create new hotel get route
app.get('/hotels/new', (req, res) => {
    res.render('hotels/new');
})
// create new hotel post route
app.post('/hotels', validateHotel, catchAsync(async (req, res, next) => {
    // if (!req.body.hotel) throw new ExpressError('Invalid Hotel Data', 400);
    const hotel = new HotelModel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
}))
// show one hotel get route
app.get('/hotels/:id', catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id).populate('reviews');
    res.render('hotels/show', { hotel });
}))
// edit hotel get route
app.get('/hotels/:id/edit', catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    res.render('hotels/edit', { hotel });
}))
// edit hotel put route
app.put('/hotels/:id', validateHotel, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndUpdate(id, { ...req.body.hotel });
    res.redirect(`/hotels/${hotel._id}`);
}))
// delete hotel route
app.delete('/hotels/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await HotelModel.findByIdAndDelete(id);
    res.redirect('/hotels');
}))
// post review route
app.post('/hotels/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    const review = new Review(req.body.review);
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
}))
// delete review route
app.delete('/hotels/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await HotelModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotels/${id}`)
}))

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
const express = require('express');
const router = express.Router({mergeParams: true});
const { validateReview } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const HotelModel = require('../models/hotel');
const Review = require('../models/review');

// post review route
router.post('/', validateReview, catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    const review = new Review(req.body.review);
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/hotels/${hotel._id}`);
}))
// delete review route
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await HotelModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/hotels/${id}`)
}))

module.exports = router;
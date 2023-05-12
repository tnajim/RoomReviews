const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const HotelModel = require('../models/hotel');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

// post review route
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
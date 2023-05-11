const express = require('express');
const router = express.Router();
const hotels = require('../controllers/hotels');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware');

// logic is in controllers folder
// index get route
router.get('/', catchAsync(hotels.index));

// createhotel form route
router.get('/new', isLoggedIn, hotels.renderNewForm);

// create hotel post route
router.post('/', isLoggedIn, validateHotel, catchAsync(hotels.createHotel));

// show one hotel get route
router.get('/:id', catchAsync(hotels.showHotel));

// edit hotel form route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hotels.renderEditForm));

// edit hotel put route
router.put('/:id', isLoggedIn, isAuthor, validateHotel, catchAsync(hotels.updateHotel));

// delete hotel route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(hotels.deleteHotel));

module.exports = router;
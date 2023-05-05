const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { hotelSchema } = require('../schemas.js');
const HotelModel = require('../models/hotel');

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

// index get route
router.get('/', catchAsync(async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
}))
// create new hotel form route
router.get('/new', (req, res) => {
    res.render('hotels/new');
})
// create new hotel post route
router.post('/', validateHotel, catchAsync(async (req, res, next) => {
    // if (!req.body.hotel) throw new ExpressError('Invalid Hotel Data', 400);
    const hotel = new HotelModel(req.body.hotel);
    await hotel.save();
    req.flash('success', 'Successfully added a new hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}))
// show one hotel get route
router.get('/:id', catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id).populate('reviews');
    res.render('hotels/show', { hotel });
}))
// edit hotel get route
router.get('/:id/edit', catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    res.render('hotels/edit', { hotel });
}))
// edit hotel put route
router.put('/:id', validateHotel, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndUpdate(id, { ...req.body.hotel });
    req.flash('success', 'Successfully updated Hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}))
// delete hotel route
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await HotelModel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Hotel!');
    res.redirect('/hotels');
}))

module.exports = router;
const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware');

const HotelModel = require('../models/hotel');

// index get route
router.get('/', catchAsync(async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
}))
// create new hotel form route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('hotels/new');
})
// create new hotel post route
router.post('/', isLoggedIn, validateHotel, catchAsync(async (req, res, next) => {
    const hotel = new HotelModel(req.body.hotel);
    hotel.author = req.user._id;
    await hotel.save();
    req.flash('success', 'Successfully added a new hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}))
// show one hotel get route
router.get('/:id', catchAsync(async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!hotel) {
        req.flash('error', 'Could not find that Hotel');
        return res.redirect('/hotels');
    }
    res.render('hotels/show', { hotel });
}))
// edit hotel get route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findById(id);
    if (!hotel) {
        req.flash('error', 'Could not find that Hotel');
        return res.redirect('/hotels');
    }
    res.render('hotels/edit', { hotel });
}))
// edit hotel put route
router.put('/:id', isLoggedIn, isAuthor, validateHotel, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndUpdate(id, { ...req.body.hotel });
    req.flash('success', 'Successfully updated Hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}))
// delete hotel route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await HotelModel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Hotel!');
    res.redirect('/hotels');
}))

module.exports = router;
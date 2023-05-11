const HotelModel = require('../models/hotel');

module.exports.index = async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
}

module.exports.renderNewForm = (req, res) => {
    res.render('hotels/new');
}

module.exports.createHotel = async (req, res, next) => {
    const hotel = new HotelModel(req.body.hotel);
    hotel.author = req.user._id;
    await hotel.save();
    req.flash('success', 'Successfully added a new hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.showHotel = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findById(id);
    if (!hotel) {
        req.flash('error', 'Could not find that Hotel');
        return res.redirect('/hotels');
    }
    res.render('hotels/edit', { hotel });
}

module.exports.updateHotel = async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndUpdate(id, { ...req.body.hotel });
    req.flash('success', 'Successfully updated Hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    await HotelModel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Hotel!');
    res.redirect('/hotels');
}
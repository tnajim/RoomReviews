const HotelModel = require('../models/hotel');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const searchQuery = req.query.q || ''; //takes q variable from search form
    const regexQuery = new RegExp(searchQuery, 'i'); //case insensitive
    const allHotels = await HotelModel.find({}); //all hotels for clustermap data
    const count = await HotelModel.countDocuments({
        $or: [
            { title: regexQuery },
            { location: regexQuery }
          ]
        }); //count all results for page count

    const page = parseInt(req.query.page) || 1; // default on page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // default page size 10
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(count / pageSize);

    // paginated query search in title or location
    const hotels = await HotelModel.find({
        $or: [
            { title: regexQuery },
            { location: regexQuery }
          ]
        })
        .sort({ '_id': -1 })
        .skip(skip)
        .limit(pageSize);
    res.render('hotels/index', { hotels, allHotels, CurrentPage: page, totalPages, count, searchQuery });
}

module.exports.renderNewForm = (req, res) => {
    res.render('hotels/new');
}

module.exports.createHotel = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send()
    const hotel = new HotelModel(req.body.hotel);
    hotel.geometry = geoData.body.features[0].geometry;
    hotel.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.author = req.user._id;
    await hotel.save();
    console.log(hotel);
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
    console.log(req.body);
    const hotel = await HotelModel.findByIdAndUpdate(id, { ...req.body.hotel });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.images.push(...imgs);
    await hotel.save();
    //$pull: pulls elements out of the images array, where filename is not exactly equal to something but in deleteImages
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await hotel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated Hotel listing!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    await HotelModel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Hotel!');
    res.redirect('/hotels');
}
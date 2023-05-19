const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//image schema for HotelSchema.images.url and filename
const ImageSchema = new Schema({
    url: String,
    filename: String,
});

// add img.thumbnail (usable property derived from db value)
ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const HotelSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HotelSchema.virtual('properties.popUpMarkup').get(function (){
    return `
    <strong><a href="/hotels/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`
});

// post middleware to delete reviews with the hotel
HotelSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Hotel', HotelSchema);
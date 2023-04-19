const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const HotelModel = require('../models/hotel');


mongoose.connect('mongodb://127.0.0.1:27017/room-reviews')
    .then(() => console.log("MongoDB Connection Established."))
    .catch(error => console.log("MongoDB Error Occured.", error));


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await HotelModel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const hotel = new  HotelModel({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await hotel.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log("Database Seeded.")
    console.log("Connection Closed.")
})

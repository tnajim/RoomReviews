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
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const hotel = new  HotelModel({
            // your user id here
            author: '645af5197ce6f05a79c95393',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi repudiandae explicabo tempore sequi quo voluptatibus eius quidem eos! Ab neque praesentium exercitationem earum beatae, amet eos accusantium sit perferendis delectus?',
            price,
            geometry: { 
              type: 'Point', 
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dtntqvwwe/image/upload/v1684718363/RoomReviews/hotel1_v4aque.jpg',
                  filename: 'RoomReviews/mqrrpvze4oyeyr0am5os'
                },
                {
                  url: 'https://res.cloudinary.com/dtntqvwwe/image/upload/v1684718367/RoomReviews/hotel3_w9txbo.jpg',
                  filename: 'RoomReviews/kd0qej5y0y1rf0wi8m29'
                }
              ]
        })
        await hotel.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log("Database Seeded.")
    console.log("Connection Closed.")
})

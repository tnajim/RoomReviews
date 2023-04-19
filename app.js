const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const HotelModel = require('./models/hotel');


mongoose.connect('mongodb://127.0.0.1:27017/room-reviews')
    .then(() => console.log("MongoDB Connection Established."))
    .catch(error => console.log("MongoDB Error Occured.", error));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
})

// index route
app.get('/hotels', async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
})

// create hotel route
app.get('/hotels/new', (req, res) => {
    res.render('hotels/new');
})

// create hotel post route
app.post('/hotels', async (req, res) => {
    const hotel = new HotelModel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
})

// show hotel route
app.get('/hotels/:id', async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    res.render('hotels/show', { hotel });
})



// listen to server
app.listen(3000, () => {
    console.log("Listening on Port 3000");
})
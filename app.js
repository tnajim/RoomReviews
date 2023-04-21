const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const HotelModel = require('./models/hotel');


mongoose.connect('mongodb://127.0.0.1:27017/room-reviews')
    .then(() => console.log("MongoDB Connection Established."))
    .catch(error => console.log("MongoDB Error Occured.", error));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); //set query string override

app.get('/', (req, res) => {
    res.render('home')
})

// index get route
app.get('/hotels', async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
})

// create hotel get route
app.get('/hotels/new', (req, res) => {
    res.render('hotels/new');
})

// create hotel post route
app.post('/hotels', async (req, res) => {
    const hotel = new HotelModel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
})

// show hotel get route
app.get('/hotels/:id', async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    res.render('hotels/show', { hotel });
})

// edit hotel get route
app.get('/hotels/:id/edit', async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    res.render('hotels/edit', { hotel });
})

// edit hotel put route
app.put('/hotels/:id', async (req, res) => {
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndUpdate(id, {...req.body.hotel});
    res.redirect(`/hotels/${hotel._id}`);
})

app.delete('/hotels/:id', async (req, res) => {
    const { id } = req.params;
    await HotelModel.findByIdAndDelete(id);
    res.redirect('/hotels');
})

// listen to server
app.listen(3000, () => {
    console.log("Listening on Port 3000");
})
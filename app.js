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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/hotels', async (req, res) => {
    const hotels = await HotelModel.find({});
    res.render('hotels/index', { hotels })
})

app.get('/hotels/:id', async (req, res) => {
    const hotel = await HotelModel.findById(req.params.id);
    res.render('hotels/show', { hotel });
})


// listen to server
app.listen(3000, () => {
    console.log("Listening on Port 3000");
})
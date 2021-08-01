const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require("../models/campground")

mongoose.connect('mongodb+srv://mus-admin:Password1@cluster0.mu9ks.mongodb.net/seeDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to db")
}).catch(err => {
    console.log("Error: ", err.message);
});

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }
}

seedDB();
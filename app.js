const express = require('express');
const path = require('path');
const expressSanitizer = require("express-sanitizer");
const mongoose = require('mongoose');
const Message = require("./models/message")

mongoose.connect('mongodb+srv://mus-admin:Password1@cluster0.mu9ks.mongodb.net/portfolioMessages?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to db")
}).catch(err => {
    console.log("Error: ", err.message);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs')
app.use(expressSanitizer())
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/public"));



app.get('/', (req, res) => {
    res.render('home')
})
app.post('/', async (req, res) => {
	req.body.message = req.sanitize(req.body.message);
    const newMessage = new Message({
        name: req.body.name,
        email: req.body.email,
        project: req.body.project,
        message: req.body.message
    });
    await newMessage.save();
    res.send("Your message was submitted. <a href='/'>Home</a>")
})

var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`)
})
const express = require('express');
const path = require('path');
const expressSanitizer = require("express-sanitizer");
const mongoose = require('mongoose');
const Message = require("./models/message");
const Blog = require("./models/blog");
const Comment = require("./models/comment");
const nodemailer = require("nodemailer");
const methodOverride = require("method-override");
require('dotenv').config();


mongoose.connect('mongodb+srv://mus-admin:Password1@cluster0.mu9ks.mongodb.net/portfolioMessages?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("connected to db")
}).catch(err => {
    console.log("Error: ", err.message);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(expressSanitizer())
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

// setup Gmail server for emailing
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});



app.get('/', (req, res) => {
    Comment.find({}, (err, allComments) => {
        if(err) {
            console.log(err);
        } else{
            res.render('home', {comments: allComments});
        }
    })
})

// contact me post route
app.post('/contact', async (req, res) => {
    req.body.contact.message = req.sanitize(req.body.contact.message);
    const newMessage = new Message(req.body.contact);
    const email = newMessage.email;
    const project = newMessage.project;
    const message = newMessage.message;
    await newMessage.save();
    
    // emailing the contact to myself
    let mailOption = {
        from: 'musshaidari@gmail.com',
        to: 'mhaidarpoor@gmail.com',
        cc: email,
        subject: project,
        html: "From: "+newMessage.name+"<br>Project: "+project+ 
        "<br>Email: "+email+"<br>-----------------<br><br>"+ message
    }
    transporter.sendMail(mailOption, (err, data) => {
        if(err){
            console.log(err)
        } else {
            console.log('email sent')
        }
    })

    res.render('contact', {name: req.body.contact.name})

})




// comment post route
app.post('/comment', async (req, res) => {
	req.body.commentMessage = req.sanitize(req.body.commentMessage);
    const newComment = new Comment({
        name: req.body.commentName,
        message: req.body.commentMessage
    });
    await newComment.save();
    res.redirect('/')
})


// #################  ROUTES ################


// ---------- GET BLOGS
app.get('/blogs', async (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log(err);
        } else {
            res.render('blogs/blogs', {blogs: blogs})
        }
    })
})

// ---------- GET NEW
app.get('/blogs/new', (req, res) => {
    res.render("blogs/new")
})

// ---------- POST NEW
app.post('/blogs', async (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
    const newBlog = new Blog(req.body.blog);
    await newBlog.save();
    res.redirect('/blogs')
})

// ---------- GET SHOW
app.get('/blogs/:id', async (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err){
            console.log(err);
        } else {
            res.render('blogs/show', {blog: blog})
        }
    })
})


// ---------- GET EDIT
app.get('/blogs/:id/edit', async (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err){
            console.log(err);
        } else {
            res.render('blogs/edit', {blog: blog})
        }
    })
})

// ---------- PUT UPDATE
app.put('/blogs/:id', async (req, res) => {
    const {id} = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog})
    res.redirect(`/blogs/${blog._id}`)
})

// ---------- DELETE
app.delete('/blogs/:id', async (req, res) => {
    const {id} = req.params;
    await Blog.findByIdAndDelete(id);
    res.redirect('/blogs');
})




// ---------- PAGE NOT FOUND
app.get('*', (req, res) => {
    res.render('notfound');
})


// ########### START SERVER
var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`)
})
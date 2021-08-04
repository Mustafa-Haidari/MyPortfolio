const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    name: String,
    title: String,
    body: String,
});

module.exports = mongoose.model("Blog", BlogSchema)
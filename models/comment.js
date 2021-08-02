const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    name: String,
    message: String
});

module.exports = mongoose.model("Comment", CommentSchema)
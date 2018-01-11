const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.connect(config.mongoUrl, {useMongoClient: true})
mongoose.Promise = global.Promise;

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  })

module.exports = Blog
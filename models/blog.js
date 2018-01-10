const mongoose = require('mongoose')

const url = "mongodb://user:password@ds247047.mlab.com:47047/blog-development"
mongoose.connect(url, {useMongoClient: true})
mongoose.Promise = global.Promise;

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
  })

module.exports = Blog
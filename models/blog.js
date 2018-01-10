const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }
const url = process.env.MONGOLAB_URL
mongoose.connect(url, {useMongoClient: true})
mongoose.Promise = global.Promise;

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
  })

module.exports = Blog
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
  module.exports = Blog

const url = "mongodb://user:password@ds247047.mlab.com:47047/blog-development"
mongoose.connect(url, {useMongoClient: true})
mongoose.Promise = global.Promise;


app.use(bodyParser.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })


app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
})

const port = 3003
app.listen(port)
console.log(`Server running on port ${port}`)
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const url = "mongodb://user:password@ds247047.mlab.com:47047/blog-development"
mongoose.connect(url, {useMongoClient: true})
mongoose.Promise = global.Promise;


app.use(bodyParser.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

const port = 3003
app.listen(port)
console.log(`Server running on port ${port}`)
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Blog = require('./models/blog')
const blogRouter = require('./controllers/blogs')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use('/api/blogs',blogRouter)

const port = 3003
app.listen(port)
console.log(`Server running on port ${port}`)
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Blog = require('./models/blog')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')

const middlewares = require('./middlewares/middlewares')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use(middlewares.tokenExtractor)
app.use('/api/blogs',blogRouter)
app.use('/api/users',usersRouter)
app.use('/api/login', loginRouter)

mongoose.connect(config.mongoUrl, { useMongoClient: true })
mongoose.Promise = global.Promise

const port = config.port


const server = http.createServer(app)


server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,server
}
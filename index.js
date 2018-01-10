const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
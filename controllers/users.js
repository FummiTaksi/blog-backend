const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const username = body.username
    if (!username || username.length <= 2) {
        return response.status(400).json({error: 'username too short'})
    }
    const password = body.password
    if (!password || password.length <= 2) {
        return response.status(400).json({error: 'password too short'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something whent wrong...' })
  }
})

module.exports = usersRouter
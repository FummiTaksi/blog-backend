const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


const formatUser = (user) => {
    return {
      id: user._id,
      username: user.username,
      name: user.name,
      adult: user.adult,
      blogs: user.blogs
    }
  }

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const username = body.username
    if (!username || username.length <= 2) {
        return response.status(400).json({error: 'username too short'})
    }
    const usersWithSameUsername = await User.find({username: username})
    if (usersWithSameUsername.length > 0 ) {
        return response.status(400).json({error: 'username must be unique'})
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
      adult: body.adult ? body.adult  : true,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    response.status(500).json({ error: 'something whent wrong...' })
  }
})

usersRouter.get('/', async(request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, url: 1 , author: 1, likes: 1} )
  response.json(users.map(formatUser))
})

module.exports = usersRouter
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const formatBlog = (blog) => {
    return {
      id: blog._id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user
    }
  }

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
                        .populate('user', { name: 1, username: 1 , adult: 1} )
    response.json(blogs.map(formatBlog));
  })

blogsRouter.post('/', async(request, response) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
    
        if (!token || !decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
        }
    
        const blogToBeAdded = request.body
        if (!blogToBeAdded.title || !blogToBeAdded.url) {
            return response.status(400).json({error: 'Bad Content'})
        }
        blogToBeAdded.likes = blogToBeAdded.likes ? blogToBeAdded.likes : 0
        const userWithSameId = await User.find({_id: decodedToken.id})
        const firstPerson = userWithSameId[0]
        blogToBeAdded.user = firstPerson._id
        const personToBeUpdated = {
            name: firstPerson.name,
            username: firstPerson.username,
            adult: firstPerson.adult,
            blogs: firstPerson.blogs
        }
        const blog = new Blog(blogToBeAdded)
        personToBeUpdated.blogs = personToBeUpdated.blogs.concat(blog)
        await User.findByIdAndUpdate(firstPerson._id, personToBeUpdated)
        const result = await blog.save()
        response.status(201).json(formatBlog(result))
    }
    catch(error) {
        response.status(400).json(error)
    }

})

blogsRouter.delete('/:id', async(request, response) => {
    try {
        const result = await Blog.findByIdAndRemove(request.params.id)
        return response.status(204).json(result)
    }
    catch(error) {
        return response.status(400).json(error)
    }

})

blogsRouter.put('/:id', async(request, response) => {
    try {
        const body = request.body
        const blog = {
            title: body.title,
            url: body.url,
            author: body.author,
            likes: body.likes
        }
        const modified = await Blog.
                            findByIdAndUpdate(request.params.id, blog, {new: true})
        response.status(200).json(modified)
    }

    catch(error) {
        response.status(400).json(error)
    }
})

module.exports =  blogsRouter
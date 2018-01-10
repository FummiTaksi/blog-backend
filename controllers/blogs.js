const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
    return {
      id: blog._id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }
  }

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs.map(formatBlog))
      })
  })

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    blog
    .save()
    .then(result => {
      response.status(201).json(formatBlog(result))
    })
})

module.exports =  blogsRouter
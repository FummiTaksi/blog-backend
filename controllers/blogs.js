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

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(formatBlog));
  })

blogsRouter.post('/', async(request, response) => {
    const blogToBeAdded = request.body
    blogToBeAdded.likes = blogToBeAdded.likes ? blogToBeAdded.likes : 0
    const blog = new Blog(blogToBeAdded)
    const result = await blog.save()
    response.status(201).json(formatBlog(result))
})

module.exports =  blogsRouter
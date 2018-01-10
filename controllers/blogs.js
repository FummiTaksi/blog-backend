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
    if (!blogToBeAdded.title || !blogToBeAdded.url) {
        return response.status(400).json({error: 'Bad Content'})
    }
    blogToBeAdded.likes = blogToBeAdded.likes ? blogToBeAdded.likes : 0
    const blog = new Blog(blogToBeAdded)
    const result = await blog.save()
    response.status(201).json(formatBlog(result))
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

module.exports =  blogsRouter
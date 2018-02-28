const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')


const formatBlog = (blog) => {
    return {
      id: blog._id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user,
      comments: blog.comments
    }
  }

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
                        .populate('user', { name: 1, username: 1 , adult: 1} ) 
                        .populate('comments', {content: 1})
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
        const person = await User.findById(decodedToken.id)
        blogToBeAdded.user = person._id
        const personToBeUpdated = {
            name: person.name,
            username: person.username,
            adult: person.adult,
            blogs: person.blogs
        }
        const blog = new Blog(blogToBeAdded)
        personToBeUpdated.blogs = personToBeUpdated.blogs.concat(blog)
        await User.findByIdAndUpdate(person._id, personToBeUpdated)
        const result = await blog.save()
        const blogsUser = await User.findById(result.user)
        result.user = blogsUser
        response.status(201).json(formatBlog(result))
    }
    catch(error) {
        response.status(400).json(error)
    }

})

blogsRouter.delete('/:id', async(request, response) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
    
        if (!token || !decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
        }
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.status(404).json({error: "Blog with this id dont exist"})
        }
        if (!blog.user) {
            const result = await Blog.findByIdAndRemove(request.params.id)
            return response.status(200).json(result)
        }
        if (blog.user.toString() !== decodedToken.id) {
            return response.status(405).json({error: 'You can remove only own blogs'})
        }
        const deleted = await Blog.findByIdAndRemove(request.params.id)
        const formatted = formatBlog(deleted)
        return response.status(200).json(formatted)
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
        response.status(200).json(formatBlog(modified))
    }

    catch(error) {
        response.status(400).json(error)
    }
})

blogsRouter.post('/:id/comments', async(request,response) => {
    try {
        const body = request.body
        const blogOfComment = await Blog.findById(body.blogId)
        if (!blogOfComment) {
            return response.status(400).json({error: 'blogId didnt match to any blogs in database!'})
        }
        if (!body.content) {
            return response.status(400).json({error: 'Comment was missing content!'})
        }
        const comment = {
            content: body.content,
            blog: body.blogId
        }
        const commentObject = new Comment(comment)
        const blogToBeUpdated = {
            title: blogOfComment.title,
            author: blogOfComment.author,
            url: blogOfComment.url,
            likes: blogOfComment.likes,
            user: blogOfComment.user,
            comments: blogOfComment.comments
        }

        blogToBeUpdated.comments = blogToBeUpdated.comments.concat(commentObject)
        await Blog.findByIdAndUpdate(blogOfComment._id, blogToBeUpdated)
        const result = await commentObject.save()

        response.status(201).json(result)
    }
    catch(error) {
        console.log("ERROR",error)
        response.status(400).json(error)
    }
})

module.exports =  blogsRouter
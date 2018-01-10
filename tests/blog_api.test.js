const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Full-stack ohjelmointi",
        author: "Matti Luukkainen",
        url: "mluukkai.github.io",
        likes: 250
    },
    {
        title: "OHjelmoinnin perusteet",
        author: "Arto Hellas",
        url: "ohpe.fi",
        likes: 90
    }
]
beforeAll(async () => {
    await Blog.remove({})
  
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
  
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

describe('GET /api/blogs', () => {

    test(' blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
      
      test(' all blogs are returned', async () => {
          const response = await api.get('/api/blogs')
          expect(response.body.length).toBe(initialBlogs.length)
      })

})



afterAll(() => {
  server.close()
})
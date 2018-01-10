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

  beforeEach(async () => {
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
  
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

describe('GET api/blogs', () => {

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

describe('POST api/blogs', () => {

    test(' with correct blog increases amount in blogs', async () => {
        const newBlog = {
            title: "How to live in Sweden",
            author: "Ulf Johanson ",
            url: "sweden.com",
            likes: 7
          }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length + 1)
                
    })

    test(' if likes is not defined, it is defined as 0', async () => {
        const newBlog = {
            title: "Introduction to manual testing",
            author: "Aleksi Mustonen",
            url: "manual.com"
        }
        const result = await api.post('/api/blogs')
                                .send(newBlog)
                                .expect(201)
                                .expect('Content-Type', /application\/json/)
        expect(result.body.likes).toBe(0)
        const response = await api.get('/api/blogs')
        const likes = response.body.map(r => r.likes)
        expect(likes).toContain(0)
    })

    test(' if title is not defined, blog is not created and status is 400', async () => {
        const withoutTitle = {
            author: "Pekka Puupää",
            url: "suomi.fi"
        }
        const result = await api.post('/api/blogs')
                                 .send(withoutTitle)
                                 .expect(400)
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(2)
    })
})

afterEach(async () => {
    await Blog.remove({})
})

afterAll(() => {
  server.close()
})
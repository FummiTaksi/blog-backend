const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUser = {
    name: "Super User",
    username: "admin",
    adult: true,
    password: "password"
}


const usersInDb = async () => {
    return await User.find({})
}
const nonExistingId = async () => {
    const blog = new Blog()
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()
  }
  
beforeAll(async () => {
    await Blog.remove({})
    await User.remove({})
  })

  beforeEach(async () => {
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
  
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    const firstUser = new User(initialUser)
    await firstUser.save()
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

    test(' if url is not defined, blog is not created and status is 400', async () => {
        const withoutUrl = {
            author: "Matti Mainio",
            title: "Suomalainen talousmarkkinoilla",
            likes: 3
        }
        const result = await api.post('/api/blogs')
                                .send(withoutUrl)
                                .expect(400)
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(2)
    })
})

describe('DELETE api/blog/:id', async() => {

    test(' when id is correct', async() => {
        let allBlogs = await Blog.find({})
        const url = "/api/blogs/"  + allBlogs[0]._id
        const result = await api.delete(url)
                                .expect(204)
        allBlogs = await Blog.find({})
        expect(allBlogs.length).toBe(1)
    })

    test(' when id dont exist, status 404 is retrieved', async() => {
        const id = await nonExistingId();
        const url = "/api/blogs/" + id
        const result = await api.delete(url)
                                .expect(204)
        const allBlogs = await Blog.find({})
        expect(allBlogs.length).toBe(2)
    })

    test(' status 400 if id is not legit', async() => {
        await api.delete("/api/blogs/3532532").expect(400)
    })

})

describe('PUT api/blog/:id', async() => {

    test(' when id is correct, value is changed and status is 200', async() => {
        let allBlogs = await Blog.find({})
        const firstBlog = allBlogs[0]
        const modified = {
            title: firstBlog.title,
            url: firstBlog.url,
            author: firstBlog.author,
            likes: 1000
        }
        const url = '/api/blogs/' + firstBlog._id
        const result = await api.put(url).send(modified).expect(200)
        expect(result.body.likes).toBe(1000)
    })

    test('with not correct if status is 400', async() => {
        let allBlogs = await Blog.find({})
        const firstBlog = allBlogs[0]
        const modified = {
            title: firstBlog.title,
            url: firstBlog.url,
            author: firstBlog.author,
            likes: 1000
        }
        const result = await api
                        .put('/api/blogs/5235235235')
                        .send(modified)
                        .expect(400)
    })
})

describe('POST /api/users', async() => {
    
        test('creating user with valid input returns 200 and user is created', async() => {
            const beforeAdding = await usersInDb();
            const newUser = {
                name: "Pink Lily",
                username: "Tir",
                adult: false,
                password: "T1r"
            }
            const result = await api
                                .post('/api/users')
                                .send(newUser)
                                .expect(200)
                                .expect('Content-Type', /application\/json/)
            const afterAdding = await usersInDb();
            expect(afterAdding.length).toBe(beforeAdding.length + 1)
        })

        test('user is not created if usernames length is 2', async() => {
            const beforeAdding = await usersInDb();
            const newUser = {
                name: "Jaakko Java",
                username: "JJ",
                adult: false,
                password: "jees"
            }
            const result = await api.
                                post('/api/users')
                                .send(newUser)
                                .expect(400)
            expect(result.body.error).toBe('username too short')
            const afterAdding = await usersInDb()
            expect(afterAdding.length).toBe(beforeAdding.length)
        })

        test('user is not created if password length is 2', async() => {
            const beforeAdding = await usersInDb()
            const newUser = {
                name: "Raimo Ruby",
                username: "RoR",
                adult: true,
                password: "12"
            }
            const result = await api.
                            post('/api/users')
                            .send(newUser)
                            .expect(400)
                
            expect(result.body.error).toBe('password too short')
            const afterAdding = await usersInDb()
            expect(afterAdding.length).toBe(beforeAdding.length)
        })

        test('cannot create user with username that is in use', async() => {
            const beforeAdding = await usersInDb();
            const result = await api.post('/api/users')
                                    .send(initialUser)
                                    .expect(400)

            expect(result.body.error).toBe('username must be unique')
            const afterAdding = await usersInDb()
            expect(afterAdding.length).toBe(beforeAdding.length)
        })

        test('if adult is not defined, it will be set to true', async() => {
            const withoutAdult = {
                name: "Jee Cotton",
                username: "Jeec",
                password: "Kukkuluuruu"
            }

            const result = await api.post('/api/users')
                                    .send(withoutAdult)
                                    .expect(200)
            expect(result.body.adult).toBeTruthy()
            const afterAdding = await usersInDb()
            expect(afterAdding[1].adult).toBeTruthy()
        })
    
    })

afterEach(async () => {
    await Blog.remove({})
    await User.remove({})
})

afterAll(() => {
  server.close()
})
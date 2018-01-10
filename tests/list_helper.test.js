const listHelper = require('../utils/list_helper')

test('dummy is called', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const emptyList = []

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('result is 0 with empty list', () => {
    
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })
})

describe('most likes', () => {
  const listWithMostLikesSecond = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: "asgas",
      title: "yes box",
      author: "t dog",
      url: "agsga",
      likes: 10,
      _v: 1
    }
  ]

  const listWithMostLikesFirst = [
    {
      _id: "asgas",
      title: "yes box",
      author: "t dog",
      url: "agsga",
      likes: 10,
      _v: 1
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]


  test('returns last element when it has most likes', () => {
    const result = listHelper.favoriteBlog(listWithMostLikesSecond);
    expect(result.likes).toBe(10)
  })

  test('returns first element when it has most likes', () => {
    const result = listHelper.favoriteBlog(listWithMostLikesFirst);
    expect(result.likes).toBe(10)
  })

  test('method dont change order of original list', () => {
    listHelper.favoriteBlog(listWithMostLikesSecond)
    expect(listWithMostLikesSecond[0].likes).toBe(5)
  })
})
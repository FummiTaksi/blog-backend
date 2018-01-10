const listHelper = require('../utils/list_helper')

const djikstra =   {
                    _id: '5a422aa71b54a676234d17f8',
                    title: 'Go To Statement Considered Harmful',
                    author: 'Edsger W. Dijkstra',
                    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                    likes: 5,
                    __v: 0
                    }

const listWithOneBlog = [djikstra]

const emptyList = []

const listWithThreeBlogs = [
  djikstra,
  {
    _id: '1',
    title: 'akuankan seikkailut',
    author: 'Aku Ankka',
    url: 'www.akuankka.fi',
    likes: 1,
    _v: 2
  },
  {
    _id: '2',
    title: "tupu hupu ja lupu",
    author: 'Aku Ankka',
    url: "www.akuankka.fi",
    likes: 0,
    _v: 3
  }
]

test('dummy is called', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

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
    djikstra,
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
    djikstra
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

describe('most blogs', () => {

  describe(' with empty list', () => {
    const result = listHelper.mostBlogs(emptyList)
    test(' name is correct', () => {
      expect(result.author).toBe('no authors in this list!')
    })

    test(' amount is 0', () => {
      expect(result.amount).toBe(0)
    })

  })

  describe(' with list containing one element', () => {
 
    const result = listHelper.mostBlogs(listWithOneBlog)

    test(' returns correct author', () => {
      expect(result.author).toBe('Edsger W. Dijkstra')
    })

    test(' returns correct amount', () => {
      expect(result.amount).toBe(1)
    })

  })

  describe('with list containing 3 elements', () => {

  const result = listHelper.mostBlogs(listWithThreeBlogs)
  test(' returns correct author', () => {
    expect(result.author).toBe('Aku Ankka')
  })

  test(' returns correct amount', () => {
    expect(result.amount).toBe(2)
  })

  })
})

describe('mostLikes', () => {
  
  describe(' with empty list', () => {
    const result = listHelper.mostLikes(emptyList)

    test(' has correct author', () => {
      expect(result.author).toBe('no authors in this list!')
    })

    test(' votes is 0', () => {
      expect(result.votes).toBe(0)
    })
  })

  describe(" with list containing three blogs and two authors", () => {
    const result = listHelper.mostLikes(listWithThreeBlogs)

    test(' has correct author', () => {
      expect(result.author).toBe('Edsger W. Dijkstra')
    })

    test(' has correct amount of votes', () => {
      expect(result.votes).toBe(5)
    })
  })
})


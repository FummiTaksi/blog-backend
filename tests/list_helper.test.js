const list = require('../utils/list_helper')

test('dummy is called', () => {
  const blogs = []
  const result = list.dummy(blogs)
  expect(result).toBe(1)
})
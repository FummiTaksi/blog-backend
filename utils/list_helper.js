const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
      return blogs.reduce((previous, next) => {
          return previous + next.likes
      },0)
  }

  const favoriteBlog = (blogs) => {
      return blogs.slice().sort((a,b) => {return a.likes < b.likes})[0];
  }  

  const mostBlogs = (blogs) => {
      
      const startObject = {author: 'no authors in this list!', amount: 0}
      return  blogs.reduce((previous,next) => {
        const blogsWithThisAuthor = blogs.filter((blog) => {
            return next.author === blog.author
        })
        const numberOfAuthors = blogsWithThisAuthor.length
        if (numberOfAuthors > previous.amount) {
            return {author: next.author, amount: numberOfAuthors}
        }
        return previous
      },startObject)
  }
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
  }
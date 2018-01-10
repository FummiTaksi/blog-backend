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

  const blogsWithAuthor = (blogs, authorName) => {
      return blogs.filter((blog) => {
          return blog.author === authorName;
      })
  }

  const mostBlogs = (blogs) => {
      
      const startObject = {author: 'no authors in this list!', amount: 0}
      return  blogs.reduce((previous,next) => {
        const numberOfAuthors = blogsWithAuthor(blogs,next.author).length
        if (numberOfAuthors > previous.amount) {
            return {author: next.author, amount: numberOfAuthors}
        }
        return previous
      },startObject)
  }

  const mostLikes = (blogs) => {
      const startObject = {author: 'no authors in this list!', votes: 0}
      return blogs.reduce((previous, next) => {
          const blogsByAuthor = blogsWithAuthor(blogs, next.author)
          const votes = totalLikes(blogsByAuthor)
          if (votes > previous.votes) {
              return {author: next.author, votes: votes}
          }
          return previous
      },startObject)
  } 
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs,mostLikes
  }
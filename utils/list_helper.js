const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
      return blogs.reduce((previous, next) => {
          return previous + next.likes
      },0)
  }

  const blogWithMostLikes = (blogs) => {
      return blogs.slice().sort((a,b) => {return a.likes < b.likes})[0];
  }  
  module.exports = {
    dummy, totalLikes, blogWithMostLikes
  }
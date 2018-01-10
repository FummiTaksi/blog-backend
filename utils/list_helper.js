const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
      return blogs.reduce((previous, next) => {
          console.log("previous",previous)
          console.log("next",next)
          return previous + next.likes
      },0)
  }
  
  module.exports = {
    dummy, totalLikes
  }
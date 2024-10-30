const dummy = (blogs) => {
    return 1
  }
const totalLikes = (blogs)=>{
    return blogs.reduce(
        (total, blog) =>
            total + blog.likes, 0
        
    );
    
}
const favoriteBlog = (blogs)=>{
    // let favourite = 0;
    // let index = 0;
    // for (let i = 0; i < blogs.length; i++){
    //     if (blogs[i].likes > favourite){
    //         favourite = blogs[i].likes
    //         index = i
    //     }
    // }
    // return blogs[index]
    return blogs.reduce((pre, current) =>
        current.likes > pre.likes ? current : pre, blogs[0]
    )
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }
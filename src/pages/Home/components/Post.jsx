import React from 'react'
import { Link } from 'react-router-dom';
import './post.css'
const Post = ({ post, users }) => {
  let theUser = null;
  users.forEach(user => {
    if(user.id === post.userId) {
      theUser = user
    }
  })
  return ( 
    <div className='post'> 
        <div className="post-header">
            <h2>{post.title}<Link to={`/comments/${post.id}`}><span className='post-comments'><i className='bx bxs-comment-dots'></i></span></Link></h2>
            <span>Posted by {theUser?.email.split("@")[0]} on {post.timestamp} </span>
        </div>
        <div className="post-content">
            <p>{post.content}</p>
        </div>
    </div>
  )
}

export default Post

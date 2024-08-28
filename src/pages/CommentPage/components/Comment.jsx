import React from 'react'
import './comment.css'

const Comment = ({ users, comment }) => {
   
    return (
        <div key={comment.id} className='comment-display-container'>
            <div className="comment-header">
                <span className='comment-author'>Posted by {
                    users.find(user => user.id === comment.userId)?.email.split("@")[0]
                } on {comment.timestamp}</span>
            </div>
            <div className="comment-content-container">
                <p className='comment-content'>{comment.content}</p>
            </div>
        </div>
    )
}

export default Comment

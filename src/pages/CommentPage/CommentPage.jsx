import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Post from '../Home/components/Post'
import { v4 as uuidv4 } from 'uuid';
import './commentPage.css'
import Comment from './components/Comment';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

const CommentPage = ({ posts, users, currentUser, setComments, comments, setCommentStatus, setTimestamp, timestamp, updateCommentsToFirebase }) => {
    const { postId } = useParams()
    const targetPost = posts.find(post => post.id === postId)

    const [comment, setComment] = useState("")


    useEffect(() => {
        setComments(targetPost?.comments)
    }, [setComments, targetPost])

    const handleSendClick = async () => {
        setCommentStatus(true)
        setTimestamp(new Date())
        const newComment = {
            id: uuidv4(),
            userId: currentUser.id,
            content: comment,
            timestamp: timestamp.toLocaleString(),
            createdAt: Timestamp.now()
        }
        // handleCreateComment
        const newComments = [...comments, newComment]
        targetPost.comments = newComments
        setComments(prevComments => [...prevComments, newComment])
        setComment("")

        // save comments to the firebase
        updateCommentsToFirebase(targetPost.id, newComments)
    }
    return (
        <div className='comment-page'>
            {
                targetPost && (
                    <div className="comment">
                        <Post post={targetPost} users={users} />
                        <div className="comment-input-container">
                            <p>Comment: </p>
                            {/* <input type="text" onChange={e => setComment(e.target.value)} value={comment} /> */}
                            <textarea type="text" onChange={e => setComment(e.target.value)} value={comment} wrap="soft" />
                            <button onClick={handleSendClick}>send</button>
                        </div>

                        {/* Comment component */}
                        {
                            comments?.map(comment => (
                                <Comment key={comment.id} post={targetPost} users={users} comment={comment} />
                            ))
                        }
                    </div>
                )
            }
        </div >
    )

}

export default CommentPage

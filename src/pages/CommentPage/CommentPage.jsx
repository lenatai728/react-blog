import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setSubmittingStatus } from '../../slices/postsSlice';
import Post from '../Home/components/Post'
import Comment from './components/Comment';
import './commentPage.css'

const CommentPage = ({ updateCommentsToFirebase, comments, setComments }) => {
    const { postId } = useParams()
    const { posts, submittingStatus } = useSelector(state => state.posts)
    const dispatch = useDispatch()

    const { users, currentUser } = useSelector(state => state.users)
    const targetPost = posts.find((post) => post.id === postId);
    const [comment, setComment] = useState("")

    useEffect(() => {
        if(submittingStatus) return;
        console.log('targetPost: ',targetPost)
        setComments(targetPost?.comments)
    }, [targetPost])

    const handleSendClick = async () => {
        dispatch(setSubmittingStatus(true))
        if(!currentUser) console.log('Cannot comment: You have not logged in')
        const time = Date.now()
        let timestamp = new Date(time)

        const newComment = {
            id: uuidv4(),
            userId: currentUser?.id,
            content: comment,
            timestamp: timestamp.toLocaleString(),
            createdAt: Timestamp.now()
        }
        // handleCreateComment
        setComments(prevComments => [...prevComments, newComment])
        const newComments = [...comments, newComment]
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
                            <textarea type="text" onChange={e => setComment(e.target.value)} value={comment} wrap="soft" />
                            <button onClick={handleSendClick}>send</button>
                        </div>
                        {/* COMMENT COMPONENT */}
                        {
                            comments?.map(comment => (
                                <Comment key={comment.id} post={targetPost} comment={comment} />
                            ))
                        }
                    </div>
                )
            }
        </div >
    )

}

export default CommentPage

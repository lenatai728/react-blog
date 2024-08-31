import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../slices/postsSlice';
import Post from '../Home/components/Post'
import Comment from './components/Comment';
import './commentPage.css'

const CommentPage = ({ updateCommentsToFirebase, fetchPostsFromFirestore }) => {
    const { postId } = useParams()
    const { posts } = useSelector(state => state.posts)
    const dispatch = useDispatch()

    const { users, currentUser } = useSelector(state => state.users)
    const targetPost = posts.find((post) => post.id === postId);
    const [comment, setComment] = useState("")

    const navigate = useNavigate()

    const handleSendClick = async () => {
        if (!currentUser) {
            alert('Login to comment!')
            navigate('/login')
            return;
        }
        setComment("")
        const time = Date.now()
        let timestamp = new Date(time)

        const newComment = {
            id: uuidv4(),
            userId: currentUser?.id,
            content: comment,
            timestamp: timestamp.toLocaleString(),
            createdAt: Timestamp.now()
        }
        // save comments to the firebase
        const newComments = [...targetPost.comments, newComment]
        await updateCommentsToFirebase(targetPost.id, newComments)
        // fetch posts from Firestore after the backend update is done
        dispatch(fetchPostsFromFirestore(setPosts))
            .catch(error => {
                console.error('Error fetching posts:', error);
            })
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
                            posts.find((post) => post.id === postId)?.comments?.map(comment => (
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

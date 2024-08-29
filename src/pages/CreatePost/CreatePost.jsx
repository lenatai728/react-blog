import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import "./createpost.css"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import db from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setSubmittingStatus } from '../../slices/postsSlice';

const CreatePost = ({ Link }) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    // REDUX
    const { currentUser } = useSelector(state => state.users)
    const { posts, submittingStatus } = useSelector(state => state.posts)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleCreate = () => {
        if (title === "" && content === "") return;
        const time = Date.now()
        let timestamp = new Date(time)

        const newPost = {
            id: uuidv4(),
            title: title,
            content: content,
            userId: currentUser?.id,
            comments: [],
            timestamp: timestamp.toLocaleString(),
            createdAt: Timestamp.now()
        }
        
        dispatch(setSubmittingStatus(true))
        addDoc(collection(db, 'posts'), newPost)
    }
    useEffect(() => {
        if (!submittingStatus) return;
        navigate('/')
    }, [posts, navigate, submittingStatus])
    return (
        <div className='create-post'>
            <Navbar Link={Link} title="Write Your Blog" dashboardActive />
            <div className='create-post-form'>
                <div className="create-post-header">
                    <h2>New Blog</h2>
                </div>
                <form onSubmit={e => e.preventDefault()}>
                    <div className="create-post-title">
                        <label htmlFor="post-title">Title</label>
                        <input type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="create-post-content">
                        <label htmlFor="post-content">Content</label>
                        <textarea id="post-content" value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    <button onClick={handleCreate}>Create</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost

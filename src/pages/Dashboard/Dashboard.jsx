import React from 'react'
import "./dashboard.css"
import Navbar from '../../components/Navbar'
import Post from '../Home/components/Post'
import { useSelector } from 'react-redux'

const Dashboard = ({ Link }) => {
    // REDUX
    const { currentUser } = useSelector(state => state.users)
    const { posts } = useSelector(state => state.posts)

    return (
        <>
            <Navbar Link={Link} title="Dashboard" dashboardActive />
            <div className='dashboard'>
                <Link to="/create-post">
                    <button className='add-new-blog-btn'>Add new blog</button>
                </Link>
                <div className="dashboard-blog-display">
                    {
                        posts.filter(post => post.userId === currentUser?.id)
                            .map(post => (
                                <div key={post.id} className="dashboard-post"><Post post={post} /></div>
                            ))
                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard

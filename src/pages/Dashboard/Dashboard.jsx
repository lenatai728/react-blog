import React from 'react'
import "./dashboard.css"
import Navbar from '../../components/Navbar'
import Post from '../Home/components/Post'
// import LoginPage from '../LoginPage/LoginPage'
const Dashboard = ({ Link, currentUser, posts, users }) => {
    return (
        <>
            <Navbar Link={Link} title="Dashboard" currentUser={currentUser} dashboardActive />
            <div className='dashboard'>
                <Link to="/create-post">
                    <button className='add-new-blog-btn'>Add new blog</button>
                </Link>
                <div className="dashboard-blog-display">
                    {
                        posts.filter(post => post.userId === currentUser?.id )
                        .map(post => (
                            <div key={post.id} className="dashboard-post"><Post post={post} users={users} /></div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard

import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Post from './components/Post'
import './home.css'


const Home = ({ posts, users, currentUser, setCurrentUser }) => {

  return (
    <div className='home'>
      <Navbar Link={Link} title="Tech blog" homeActive currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="home-posts">
        {
          posts?.map(post => (
            <div className="home-post" key={post.id}>
              <Post post={post} users={users} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home

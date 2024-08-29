import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Post from './components/Post'
import './home.css'
import { useSelector } from 'react-redux'


const Home = () => {
  // REDUX
  const { posts } = useSelector(state => state.posts)

  return (
    <div className='home'>
      <Navbar Link={Link} title="Tech blog" homeActive />
      <div className="home-posts">
        {
          posts?.map(post => (
            <div className="home-post" key={post.id}>
              <Post post={post} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home

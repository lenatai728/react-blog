import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './app.css'
import { API_GET_POSTS, API_GET_USERS } from './global/constants'
import CreatePost from './pages/CreatePost/CreatePost'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import LoginPage from './pages/LoginPage/LoginPage'
import Footer from './components/Footer'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import CommentPage from './pages/CommentPage/CommentPage'

// fetch posts from backend server
async function fetchAPI(setPosts) {
  let res = await fetch(API_GET_POSTS)
  let { posts } = await res.json()
  setPosts(posts)
}
// fetch users from backend server
async function fetchUsers(setUsers) {
  let res = await fetch(API_GET_USERS)
  let { users } = await res.json()
  setUsers(users)
}
// register feature
async function fetchSetUsers(users) {
  await fetch(API_GET_USERS, {
    method: "PUT",
    headers: {
      'Content-type': "application/json"
    },
    body: JSON.stringify({ users })
  })
}
// fetch posts into backend server
async function fetchSetPosts(posts) {
  await fetch(API_GET_POSTS, {
    method: "PUT",
    headers: {
      'Content-type': "application/json"
    },
    body: JSON.stringify({ posts })
  })
}

const App = () => {
  const [posts, setPosts] = useState([])
  const [submittingStatus, setSubmittingStatus] = useState(false)
  const [users, setUsers] = useState([])
  const [timestamp, setTimestamp] = useState(new Date())
  // backup for user login
  // const storedUser = localStorage.getItem("currentUser")
  // const storedUserId = JSON.parse(localStorage.getItem("currentUserId"))
  // const storedUser = users.find(user => user.id === storedUserId)
  // const initialUser = storedUser ?  JSON.parse(storedUser) : null;
  // const initialUser = storedUser ?  storedUser : null;
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem("currentUserId"));
    const storedUser = users.find(user => user.id === storedUserId);
    const initialUser = storedUser || null;
    setCurrentUser(initialUser);
  }, [users]);

  const [signupStatus, setSignupStatus] = useState(false)
  // comment feature
  const [commentStatus, setCommentStatus] = useState(false)
  const [comments, setComments] = useState([])
  // const handleCreateComment = (newComment) => {
  //   setComments(prevComments => [...prevComments, newComment])
  //   console.log("handleCreateComment executed")
  // }

  const handleCreatePost = (newPost) => {
    setSubmittingStatus(true);
    setPosts((prevPosts) => [...prevPosts, newPost]);
  }
  // signup feature
  const handleSignUpUser = (newUser) => {
    setSignupStatus(true)
    setUsers(prevUsers => [...prevUsers, newUser])
  }
  // login feature
  const handleAuthenticateUser = (email, password) => {
    const user = users.find(user => user.email === email && user.password === password)
    if (user) {
      setCurrentUser(user)
      // localStorage.setItem("currentUser", JSON.stringify(user))
      localStorage.setItem("currentUserId", JSON.stringify(user.id))
    }
    else {
      setCurrentUser(null)
      // localStorage.setItem("currentUser", null)
      localStorage.setItem("currentUserId", null)
    }
  }

  useEffect(() => {
    fetchAPI(setPosts)
    fetchUsers(setUsers)
  }, [])
  useEffect(() => {
    if (!submittingStatus) {
      return
    }
    fetchSetPosts(posts)
      .then(posts => setSubmittingStatus(false))
      .catch(err => console.log(err))
  }, [posts, submittingStatus])
  useEffect(() => {
    if (!signupStatus) {
      return
    }
    fetchSetUsers(users)
      .then(users => setSignupStatus(false))
      .catch(err => console.log(err))
  }, [users, signupStatus])
  // comment
  useEffect(() => {
    if (!commentStatus) {
      return
    }
    fetchSetPosts(posts)
      .then(posts => setSubmittingStatus(false))
      .catch(err => console.log(err))
  }, [posts, commentStatus])
  return (
    <div className='wrapper'>
      <div className="main-container">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home posts={posts} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} />}></Route>
            <Route path='/dashboard' element={<Dashboard Link={Link} currentUser={currentUser} posts={posts} users={users} />}></Route>
            <Route path='/create-post' element={<CreatePost Link={Link} posts={posts} setPosts={setPosts} handleCreatePost={handleCreatePost} currentUser={currentUser} submittingStatus={submittingStatus} setTimestamp={setTimestamp} timestamp={timestamp} />}></Route>
            <Route path='/login' element={<LoginPage Link={Link} handleAuthenticateUser={handleAuthenticateUser} currentUser={currentUser} />}></Route>
            <Route path='/signup' element={<SignUpPage Link={Link} handleSignUpUser={handleSignUpUser} currentUser={currentUser} setCurrentUser={setCurrentUser} users={users} />}></Route>
            <Route path='/comments/:postId' element={<CommentPage posts={posts} users={users} currentUser={currentUser} setComments={setComments} comments={comments} setCommentStatus={setCommentStatus} timestamp={timestamp} setTimestamp={setTimestamp} />}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App

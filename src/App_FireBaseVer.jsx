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
import db from './firebase'
import { collection, getDocs, writeBatch, doc, query, orderBy, updateDoc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

// @ Function to fetch post from Firestore
async function fetchPostsFromFirestore(setPosts) {
  try { 
    const postsRef = collection(db, 'posts') 
    const q = query(postsRef, orderBy('createdAt')) 
    const postsSnapshot = await getDocs(q)
    const posts = postsSnapshot.docs.map(doc => doc.data());
    setPosts(posts);
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}
async function fetchUsersFromFirestore(setUsers) {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => doc.data())
    setUsers(users)
    // const users = []
    // onSnapshot.forEach(doc => {
    //   users.push(doc.data())
    //   setUsers(users)
    // })
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}
async function updateCollectionInFirestore(collectionName, documents) {
  try {
    const collectionRef = collection(db, collectionName);
    const batch = writeBatch(db);
    documents.forEach(document => {
      // add into firebase
      const docRef = doc(collectionRef, document.id);
      batch.set(docRef, document);
    });
    await batch.commit();
    console.log('Collection updated: ', collectionName);
  } catch (error) {
    console.error('Error updating collection: ', error);
  }
}
// update comments field
async function updateCommentsToFirebase(docId, newComments) {
  const docRef = doc(db, 'posts', docId);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    updateDoc(docRef, { comments: newComments })
      .then(() => {
        console.log('Field value updated successfully');
      })
      .catch((error) => {
        console.error('Error updating field value:', error);
      });
  }
}

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
      console.log("user not found")
      setCurrentUser(null)
      // localStorage.setItem("currentUser", null)
      localStorage.setItem("currentUserId", null)
    }
  }

  // useEffect(() => {
  //   // fetchAPI(setPosts)
  //   fetchPostsFromFirestore(setPosts)
  //   // fetchUsers(setUsers)
  //   // no need because the below useEffect already did the job
  //   // fetchUsersFromFirestore(setUsers)
  // }, [])
  useEffect(() => {
    // if (!submittingStatus) {
    //   return
    // }
    // fetchSetPosts(posts)
    //   .then(posts => setSubmittingStatus(false))
    //   .catch(err => console.log(err))

    // updateCollectionInFirestore('posts', posts)
    //   .then(posts => setSubmittingStatus(false))

    fetchPostsFromFirestore(setPosts)
      .then(posts => setSubmittingStatus(false))
  }, [posts, submittingStatus])
  // useEffect(() => {
  //   if (!signupStatus) {
  //     return
  //   }
  //   fetchSetUsers(users)
  //     .then(users => setSignupStatus(false))
  //     .catch(err => console.log(err))
  // }, [users, signupStatus])
  useEffect(()=>{
    fetchUsersFromFirestore(setUsers)
      .then(users => setSignupStatus(false))
  }, [users, signupStatus])

  // comment
  // useEffect(() => {
  //   if (!commentStatus) {
  //     return
  //   }
  //   fetchSetPosts(posts)
  //     .then(posts => setSubmittingStatus(false))
  //     .catch(err => console.log(err))
  //     .then(posts => setSubmittingStatus(false))
  // }, [posts, commentStatus])


  return (
    <div className='wrapper'>
      <div className="main-container">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home posts={posts} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} />}></Route>
            <Route path='/dashboard' element={<Dashboard Link={Link} currentUser={currentUser} posts={posts} users={users} />}></Route>
            <Route path='/create-post' element={<CreatePost Link={Link} posts={posts} setPosts={setPosts} handleCreatePost={handleCreatePost} currentUser={currentUser} setCurrentUser={setCurrentUser} submittingStatus={submittingStatus} setTimestamp={setTimestamp} timestamp={timestamp} setSubmittingStatus={setSubmittingStatus} />}></Route>
            <Route path='/login' element={<LoginPage Link={Link} handleAuthenticateUser={handleAuthenticateUser} currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
            <Route path='/signup' element={<SignUpPage Link={Link} handleSignUpUser={handleSignUpUser} currentUser={currentUser} setCurrentUser={setCurrentUser} users={users} />}></Route>
            <Route path='/comments/:postId' element={<CommentPage posts={posts} users={users} currentUser={currentUser} setComments={setComments} comments={comments} setCommentStatus={setCommentStatus} setTimestamp={setTimestamp} timestamp={timestamp} updateCommentsToFirebase={updateCommentsToFirebase} />}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App

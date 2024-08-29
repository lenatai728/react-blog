import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './app.css'
import CreatePost from './pages/CreatePost/CreatePost'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import LoginPage from './pages/LoginPage/LoginPage'
import Footer from './components/Footer'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import CommentPage from './pages/CommentPage/CommentPage'

import db from './firebase'
import { collection, getDocs, doc, query, orderBy, updateDoc, getDoc } from 'firebase/firestore'

import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser, setUsers } from './slices/usersSlice'
import { setPosts, setSubmittingStatus } from './slices/postsSlice'

// @Functions to fetch data from Firestore
const fetchPostsFromFirestore = () => {
  return async (dispatch) => {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, orderBy('createdAt'))
      const postsSnapshot = await getDocs(q)
      const posts = postsSnapshot.docs.map(doc => doc.data());
      dispatch(setPosts(posts))
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }
}
const fetchUsersFromFirestore = () => {
  return async (dispatch) => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data())
      dispatch(setUsers(users))
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }
}
// @Function to update/PUT comments field in firestore document
async function updateCommentsToFirebase(targetPostId, newComments) {
  let docId;
  const postsCollectionRef = collection(db, 'posts');
  // find target document id
  try {
    const querySnapshot = await getDocs(postsCollectionRef);
    querySnapshot.forEach((doc) => {
      if (String(doc.data().id) === targetPostId) {
        docId = String(doc.id);
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
  // update field in the document
  const docRef = doc(db, 'posts', docId);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    try {
      await updateDoc(docRef, { comments: newComments });
      console.log('Field value updated successfully');
    } catch (error) {
      console.error('Error updating field value:', error.code, error.message);
    }
  }
}

const App = () => {
  const [comments, setComments] = useState([])
  const { submittingStatus } = useSelector(state => state.posts)
  const dispatch = useDispatch();

  // LOGIN FEATURE
  const handleAuthenticateUser = (email, password) => {
    return (dispatch, getState) => {
      const { users } = getState().users
      const user = users.find(user => user.email === email && user.password === password)
      dispatch(setCurrentUser(user || null))
    }
  }
  // USE EFFECTS
  useEffect(() => {
    dispatch(fetchPostsFromFirestore(setPosts))
      .then(() => dispatch(setSubmittingStatus(false)))
  }, [dispatch, submittingStatus])

  useEffect(() => {
    dispatch(fetchUsersFromFirestore(setUsers));
  }, [dispatch])

  return (
    <div className='wrapper'>
      <div className="main-container">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/dashboard' element={<Dashboard Link={Link} />}></Route>
            <Route path='/create-post' element={<CreatePost Link={Link} />}></Route>
            <Route path='/login' element={<LoginPage Link={Link} handleAuthenticateUser={handleAuthenticateUser} />}></Route>
            <Route path='/signup' element={<SignUpPage Link={Link} />}></Route>
            <Route path='/comments/:postId' element={<CommentPage setComments={setComments} comments={comments} updateCommentsToFirebase={updateCommentsToFirebase} />}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import './signupPage.css'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import db from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';

const SignUpPage = ({ Link, handleSignUpUser, currentUser, setCurrentUser, users }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignupClick = () => {
        // check email & password
        if(email.length === 0 || password.length === 0) return;
        if(users.find(user => user.email === email)) return;
        const newUser = {
            id: uuidv4(),
            email: email,
            password: password
        }
        // handleSignUpUser(newUser)
        // addUserIntoFirestore('users', newUser)
        addDoc(collection(db, 'users'), newUser)
        // localStorage.setItem("currentUser", JSON.stringify(newUser))
        // localStorage.setItem("currentUserId", JSON.stringify(newUser.id))
    }
    // not used now
    const firebaseAuthSignUp = async () => {
        try {
            const auth = getAuth()
            await createUserWithEmailAndPassword(auth, email, password)
            console.log('User logged in successfully!');
            setEmail("")
            setPassword("")
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const navigate = useNavigate()
    useEffect(() => {
        if (currentUser) {
            navigate('/')
        }
    }, [currentUser, navigate])
    return (
        <>
            <Navbar Link={Link} title="Sign up" dashboardActive />
            <form className='signup-page' onSubmit={e => e.preventDefault()}>
                <div className="signup-container">
                    <h2>Sign up</h2>
                    <div className="signup-email">
                        <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} value={email} />
                    </div>
                    <div className="signup-password">
                        <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} />
                    </div>
                    <div className="signup-login-link">
                        <Link to='/login'><p>already have an account?</p></Link>
                    </div>
                    <div className="signup-btn">
                        <button formAction='submit' onClick={handleSignupClick}>Sign up</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default SignUpPage

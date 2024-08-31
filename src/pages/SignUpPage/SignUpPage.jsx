import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import './signupPage.css'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import db from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../slices/usersSlice';

const SignUpPage = ({ Link }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // REDUX
    const dispatch = useDispatch()
    const { currentUser, users } = useSelector(state => state.users)

    const handleSignupClick = () => {
        // check email & password
        if (email.trim().length === 0 || password.trim().length === 0) return;
        if (users.find(user => user.email === email.trim())) return;
        const newUser = {
            id: uuidv4(),
            email: email.trim(),
            password: password.trim()
        }
        addDoc(collection(db, 'users'), newUser)    
        dispatch(setCurrentUser(newUser))
    }

    const navigate = useNavigate()
    useEffect(() => {
        if(currentUser) {
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
                        <input 
                            required={true}
                            type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} value={email} 
                        />
                    </div>
                    <div className="signup-password">
                        <input 
                            required={true}
                            type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} 
                        />
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

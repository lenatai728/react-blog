import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import "./loginPage.css"
import { useDispatch, useSelector } from 'react-redux'

const LoginPage = ({ Link, handleAuthenticateUser }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //  REDUX
  const { currentUser } = useSelector(state => state.users)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const handleLogInClick = () => {
    dispatch(handleAuthenticateUser(email.trim(), password.trim()))
  }

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  return (
    <>
      <Navbar Link={Link} title="Login" dashboardActive />
      <form className='login-page' onSubmit={e => e.preventDefault()}>
        <div className="login-container">
          <h2>Login</h2>
          <div className="login-email">
            <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} value={email} />
            <i className='bx bx-at'></i>
          </div>
          <div className="login-password">
            <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} />
            <i className='bx bx-lock-alt' ></i>
          </div>
          <div className="login-signup-link">
            <Link to='/signup'><p>don't have an account?</p></Link>
          </div>
          <div className="login-btn">
            <button formAction='submit' onClick={handleLogInClick}>Login</button>
          </div>
          <div className="login-demo-account">
            <span>Demo account: </span>
            <p className="email">Email: demo@example.com</p>
            <p className="password">Password: demo123</p>
          </div>
        </div>
      </form>
    </>
  )
}

export default LoginPage

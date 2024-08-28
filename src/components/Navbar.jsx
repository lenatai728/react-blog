import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import './navbar.css'
const Navbar = ({ Link, title, homeActive, dashboardActive, currentUser, setCurrentUser }) => {
    const handleLogoutClick = async () => {
        // const auth = getAuth()
        // try {
        //     signOut(auth)
        //     setCurrentUser(null)
        // } catch (error) { console.log(error) }
        setCurrentUser(null)
        // localStorage.setItem("currentUser", null)
        // localStorage.setItem("currentUserId", null)
    }
    return (
        <div className='navbar'>
            <div className="navbar-content">
                <h1>{title}</h1>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${homeActive && 'nav-link--active'}`}>Home</Link>
                    {
                        currentUser ? (
                            <Link to="/dashboard" className={`nav-link ${dashboardActive && `nav-link--active`}`}>Dashboard</Link>
                        ) : (
                            <Link to="/login" className={`nav-link ${dashboardActive && `nav-link--active`}`}>Dashboard</Link>
                        )
                    }
                   
                    {
                        currentUser ? (
                             <div className="nav-logout">
                                <button className="nav-login-btn" onClick={handleLogoutClick}>Log out</button>
                                <span className="nav-logout-nametag">Logged in as {currentUser?.email?.split("@")[0]}</span>
                            </div>
                        ) : (
                            <Link to="/login"><button className="nav-login-btn">Log in</button></Link>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar

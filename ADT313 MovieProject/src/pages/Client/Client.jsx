import React, { useEffect, useContext, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../utils/context/AuthContext';
import './Client.css';

function Client() {
    const { auth } = useContext(AuthContext);
    const { clearAuthData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        clearAuthData();
        navigate('/');
    }, [navigate, clearAuthData]);

    return (
        <>
            <main className="box">
                <header>
                    <div className="header-container">
                        <h1 className="title-text" onClick={() => navigate('/home')}></h1>
                        <nav className="top-nav">
                            <ul>
                                <li>
                                    <div className='compo'>
                                    <div className="icon">
                                        <FontAwesomeIcon icon={faUserCircle} />
                                        </div>
                                        <div className="user-info">
                                        <span>{`${auth.user.firstName} ${auth.user.middleName} ${auth.user.lastName}`}</span>
                                        </div>
                                        <div className="user-role">
                                        <span>{auth.user.role}</span>
                                    </div>  
                                    </div>
                                </li>
                                <li onClick={() => navigate('/home')}>
                                    <span>Movies</span>
                                </li>
                                <li onClick={handleLogout} className='out'>
                                    <span>Logout</span>
                                </li>

                            </ul>
                        </nav>
                    </div>
                </header>

                <article className="main-content">
                    <Outlet />
                </article>
            </main>
        </>
    );
}

export default Client;
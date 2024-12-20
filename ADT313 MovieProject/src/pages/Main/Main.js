import { useEffect, useContext, useCallback, useState } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const { auth, clearAuthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleResetTab = () => {
    localStorage.setItem('tab', JSON.stringify('cast'));
  };

  const handleLogout = useCallback(() => {
    const confirmLogout = window.confirm('Are you sure you want to logout?'); // Ask for confirmation
    if (confirmLogout) {
      setIsLoggingOut(true); 
      setTimeout(() => {
        clearAuthData(); 
        setIsLoggingOut(false); 
        navigate('/');
      }, 3000);
    }
  }, [clearAuthData, navigate]);

  useEffect(() => {
    if (!auth.accessToken) {
      handleLogout();
    }
  }, [auth.accessToken, handleLogout]);

  return (
    <div className="Main">
      <div className="container">
        <div className="navigation">
          <ul>
            <li>
              <a onClick={() => navigate('/main/dashboard')}>Dashboard</a>
            </li>
            <li>
              <a onClick={() => navigate('/main/movies')}>Movies</a>
            </li>
            {auth.accessToken ? (
              <li className="logout">
                <a onClick={handleLogout}>Log Out</a>
              </li>
            ) : (
              <li className="login">
                <a onClick={() => navigate('/login')}>Login</a> {/* Updated to navigate to login */}
              </li>
            )}
          </ul>
        </div>
        <div className="outlet">
          {isLoggingOut ? (
            <div className="loading">Logging out...</div> 
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
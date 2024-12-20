import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { AuthContext } from '../../../utils/context/AuthContext';
import axios from 'axios';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const { setAuthData } = useContext(AuthContext);

  //alert-box
  const [alertMessage, setAlertMessage] = useState('');

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  let apiEndpoint;

  if (window.location.pathname.includes('/admin')) {
    apiEndpoint = '/admin/login';
  } else {
    apiEndpoint = '/user/login';
  }

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
    console.log(data);

    await axios({
      method: 'post',
      url: apiEndpoint,
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthData({
          accessToken: res.data.access_token,
          user: res.data.user,
        });
        setAlertMessage(res.data.message);
        setTimeout(() => {
          if (res.data.user.role === 'admin') {
            navigate('/main/dashboard');
          } else {
            navigate('/home')
          }
          setStatus('idle');
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setAlertMessage(e.response?.data?.message || e.message);
        setTimeout(() => {
          setAlertMessage('');
          setStatus('idle');
        }, 3000);
      });
  };

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log('Auth Set Updated:', auth);
  }, [auth]);

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='Login'>
      <div className='Login_main-container'>
        <form>
          <div className='Login_form-container'>
          <h3>Login</h3>
            <div>
            {debounceState && isFieldsDirty && email == '' && (
                <span className='errors'>*This field cannot be left empty</span>
              )}
              <div className='Login_form-group'>
                <label>E-mail:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
            </div>
            <div>
            {debounceState && isFieldsDirty && password === '' && (
                <span className='errors'>*This field cannot be left empty</span>
              )}
              <div className='Login_form-group'>
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              <div className='Login_show-password'>
                <input
                  type='checkbox'
                  checked={isShowPassword}
                  onChange={handleShowPassword}
                />
                <label>Show Password</label>
              </div>
            </div>
            <div className='Login-container'>
              <button
                disabled={status === 'loading'}
                onClick={() => {
                    if (email && password) {
                        handleLogin();
                      } else {
                        setIsFieldsDirty(true);
                        if (email === '') {
                          emailRef.current.focus();
                        }
                        if (password === '') {
                          passwordRef.current.focus();
                        }
                      }
                    }}
              >
                {status === 'idle' ? 'Login' : 'Loading'}
              </button>
            </div>
            <div className='Login_container'>
            <span><small>Don't have an account? <a href='/register'>Register</a></small></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

import { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; 
import logoLogin from '../assets/logo_login.png';
import logoLoginEmail from '../assets/logo_login_email.png';
import logoLoginPassword from '../assets/logo_login_password.png';

const LoginForm = () => {
  const [focusedField, setFocusedField] = useState<'none' | 'username' | 'password'>('none');
  const [isFlipping, setIsFlipping] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFocus = (field: 'username' | 'password') => {
    setIsFlipping(true);
    setFocusedField(field); 
  };

  const handleBlur = () => {
    setIsFlipping(true);
    setFocusedField('none');
  };

  const handleAnimationEnd = () => setIsFlipping(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username: username,
        password: password
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      alert('Login exitoso');
    } catch (error: any) {
      alert('Login fallido: ' + (error.response?.data?.message || error.message));
    }
  };

  let iconSrc = logoLogin;
  if (focusedField === 'username') iconSrc = logoLoginEmail;
  if (focusedField === 'password') iconSrc = logoLoginPassword;

  return (
    <div className="login-container">
      <div className={`login-card${focusedField !== 'none' ? ' glow' : ''}`}>
        <div className={`login-icon${isFlipping ? ' flipping' : ''}`} onAnimationEnd={handleAnimationEnd}>
          <img src={iconSrc} alt="Usuario" className="login-img" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label>
          <div className="input-icon-group">
            <i className="fas fa-at"></i>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={() => handleFocus('username')}
              onBlur={handleBlur}
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>

          <label htmlFor="password">Contraseña</label>
          <div className="input-icon-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <div className="remember-forgot">
            <a href="#" className="forgot-password">Olvidé mi contraseña</a>
          </div>

          <button type="submit">INICIAR SESIÓN</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

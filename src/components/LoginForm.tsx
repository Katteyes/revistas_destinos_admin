import { useState } from 'react';
import './LoginForm.css'; 
import logoLogin from '../assets/logo_login.png';
import logoLoginEmail from '../assets/logo_login_email.png';
import logoLoginPassword from '../assets/logo_login_password.png';

const LoginForm = () => {
    const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
    const [isFlipping, setIsFlipping] = useState(false);

      let iconSrc = logoLogin;
  if (focusedField === 'email') iconSrc = logoLoginEmail;
  if (focusedField === 'password') iconSrc = logoLoginPassword;

  const handleFocus = (field: 'email' | 'password') => {
    setIsFlipping(true);
    setFocusedField(field);
  };

  const handleBlur = () => {
    setIsFlipping(true);
    setFocusedField('none');
  };
    const handleAnimationEnd = () => {
    setIsFlipping(false);
  };

  return (
    <div className="login-container">
      <div className={`login-card${focusedField !== 'none' ? ' glow' : ''}`}>
        <div className={`login-icon${isFlipping ? ' flipping' : ''}`} onAnimationEnd={handleAnimationEnd}>
          <img src={iconSrc} alt="Usuario" className="login-img" />
        </div>
        <form className="login-form">
          <label htmlFor="email">Correo electrónico</label>
          <div className="input-icon-group">
            <i className="fas fa-at"></i>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ingresa tu correo electronico"
            required
            onFocus={() => handleFocus('email')}
            onBlur = {handleBlur}
          />
        </div>
          <label htmlFor="password">Contraseña</label>
          <div className="input-icon-group">
            <i className="fas fa-lock"></i>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            required
            onFocus={() => handleFocus('password')}
            onBlur= {handleBlur}
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

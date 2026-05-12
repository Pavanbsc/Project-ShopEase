import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaApple,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaShoppingBag,
  FaUser,
  FaUserShield,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialLoginState = {
  email: '',
  password: '',
  rememberMe: false,
};

const initialSignupState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
};

function AuthForm({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  const [mode, setMode] = useState(initialMode);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState(initialLoginState);
  const [signupData, setSignupData] = useState(initialSignupState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.pathname.includes('/register')) {
      setMode('signup');
    } else if (location.pathname.includes('/login')) {
      setMode('login');
    }
  }, [location.pathname]);

  const passwordStrength = useMemo(() => {
    if (mode !== 'signup') return 0;

    const password = signupData.password;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [mode, signupData.password]);

  const strengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];

  const handleModeToggle = (nextMode) => {
    if (isSubmitting || nextMode === mode) return;
    setErrors({});
    setMode(nextMode);
    navigate(nextMode === 'login' ? '/login' : '/register');
  };

  const validateLogin = () => {
    const nextErrors = {};

    if (!loginData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(loginData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!loginData.password.trim()) {
      nextErrors.password = 'Password is required';
    }

    return nextErrors;
  };

  const validateSignup = () => {
    const nextErrors = {};

    if (!signupData.name.trim()) {
      nextErrors.name = 'Full name is required';
    }

    if (!signupData.email.trim()) {
      nextErrors.signupEmail = 'Email is required';
    } else if (!emailRegex.test(signupData.email)) {
      nextErrors.signupEmail = 'Enter a valid email address';
    }

    if (!signupData.password.trim()) {
      nextErrors.signupPassword = 'Password is required';
    }

    if (!signupData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    return nextErrors;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateLogin();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    try {
      setIsSubmitting(true);
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      // Update AuthContext with user data
      if (response?.user) {
        setUser(response.user);
      }

      const role = response?.role || response?.user?.role || 'USER';
      toast.success('Login successful! Welcome back to ShopEase.');
      setLoginData(initialLoginState);
      navigate(role === 'ADMIN' ? '/admin/dashboard' : '/home');
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateSignup();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    try {
      setIsSubmitting(true);
      const response = await registerUser({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role,
      });

      // Update AuthContext with user data
      if (response?.user) {
        setUser(response.user);
      }

      const role = response?.role || response?.user?.role || signupData.role || 'USER';
      toast.success(response?.message || 'Account ready. You are now signed in.');
      setSignupData(initialSignupState);
      navigate(role === 'ADMIN' ? '/admin/dashboard' : '/home');
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page--restored">
      <aside className="auth-brand-panel" aria-hidden="true">
        <div className="auth-logo-wrapper">
          <div className="auth-logo-icon">
            <FaShoppingBag />
          </div>
          <h2 className="auth-logo-text">ShopEase</h2>
        </div>

        <p className="auth-tagline">
          A premium shopping experience designed to feel fast, simple, and effortless.
        </p>

        <div className="auth-features">
          <article className="auth-feature">
            <div className="auth-feature-icon">
              <FaShoppingBag />
            </div>
            <div>
              <h4>Clean shopping flow</h4>
              <p>Find products faster with a polished and intuitive interface.</p>
            </div>
          </article>

          <article className="auth-feature">
            <div className="auth-feature-icon">
              <FaUserShield />
            </div>
            <div>
              <h4>Secure access</h4>
              <p>Protected login and role-based access for users and admins.</p>
            </div>
          </article>

          <article className="auth-feature">
            <div className="auth-feature-icon">
              <FaLock />
            </div>
            <div>
              <h4>Modern account system</h4>
              <p>Create, sign in, and continue shopping with confidence.</p>
            </div>
          </article>
        </div>
      </aside>

      <section className="auth-card auth-card--right" aria-label="Authentication form">
        <div className="auth-form-container">
          <header className="auth-header">
            <div className="brand-mark" aria-hidden="true">
              <FaShoppingBag />
            </div>
            <h1>ShopEase</h1>
            <p>Smart Shopping Made Simple</p>
          </header>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeToggle('login')}
              disabled={isSubmitting}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => handleModeToggle('signup')}
              disabled={isSubmitting}
            >
              Sign up
            </button>
          </div>

          <div className={`form-wrapper ${mode === 'signup' ? 'slide-left' : 'slide-right'}`}>
            {mode === 'login' ? (
              <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
              <label className="input-group">
                <span className="input-icon" aria-hidden="true">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={loginData.email}
                  onChange={(event) =>
                    setLoginData((previous) => ({ ...previous, email: event.target.value }))
                  }
                />
              </label>
              {errors.email ? <p className="error-text">{errors.email}</p> : null}

              <label className="input-group">
                <span className="input-icon" aria-hidden="true">
                  <FaLock />
                </span>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(event) =>
                    setLoginData((previous) => ({ ...previous, password: event.target.value }))
                  }
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowLoginPassword((previous) => !previous)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </label>
              {errors.password ? <p className="error-text">{errors.password}</p> : null}

              <div className="auth-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(event) =>
                      setLoginData((previous) => ({ ...previous, rememberMe: event.target.checked }))
                    }
                  />
                  Remember me
                </label>
                <a href="#" className="auth-link muted-link">
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>

              <p className="auth-divider">or continue with</p>

              <div className="social-auth" aria-label="Social sign in options">
                <button type="button" className="social-btn" aria-label="Continue with Google">
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="social-btn social-btn--apple"
                  aria-label="Continue with Apple"
                >
                  <FaApple />
                  <span>Apple</span>
                </button>
              </div>

              <p className="switch-text">
                New user?{' '}
                <Link to="/register" onClick={() => handleModeToggle('signup')}>
                  Sign up
                </Link>
              </p>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
              <label className="input-group">
                <span className="input-icon" aria-hidden="true">
                  <FaUser />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(event) =>
                    setSignupData((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
              </label>
              {errors.name ? <p className="error-text">{errors.name}</p> : null}

              <label className="input-group">
                <span className="input-icon" aria-hidden="true">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={signupData.email}
                  onChange={(event) =>
                    setSignupData((previous) => ({ ...previous, email: event.target.value }))
                  }
                />
              </label>
              {errors.signupEmail ? <p className="error-text">{errors.signupEmail}</p> : null}

              <label className="input-group">
                <span className="input-icon" aria-hidden="true">
                  <FaLock />
                </span>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(event) =>
                    setSignupData((previous) => ({ ...previous, password: event.target.value }))
                  }
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowSignupPassword((previous) => !previous)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </label>
              {errors.signupPassword ? <p className="error-text">{errors.signupPassword}</p> : null}

              <label className="input-group">
                <span className="input-icon" aria-hidden="true">
                  <FaLock />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={(event) =>
                    setSignupData((previous) => ({ ...previous, confirmPassword: event.target.value }))
                  }
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowConfirmPassword((previous) => !previous)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </label>
              {errors.confirmPassword ? <p className="error-text">{errors.confirmPassword}</p> : null}

              <div className="password-strength" aria-live="polite">
                <div className="strength-track">
                  <div className={`strength-fill level-${passwordStrength}`} />
                </div>
                <span>{strengthLabel}</span>
              </div>

              <label className="input-group role-select">
                <span className="input-icon" aria-hidden="true">
                  <FaUserShield />
                </span>
                <select
                  value={signupData.role}
                  onChange={(event) =>
                    setSignupData((previous) => ({ ...previous, role: event.target.value }))
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>

              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Creating...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              <p className="switch-text">
                Already have an account?{' '}
                <Link to="/login" onClick={() => handleModeToggle('login')}>
                  Login
                </Link>
              </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthForm;

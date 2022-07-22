import React from 'react';
import axios from 'axios';
import { Alert, IconButton, Input, InputAdornment } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { COLORS, ENDPOINT_HOME, ENDPOINT_PATHS } from './constants';
import Logo from './logo.svg';
import CarroCareWorkshop from './images/carro_care_workshop.jpeg';
import { JwtTokenContext } from './App';
import useWindowDimensions from './hooks/useWindowDimensions';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);
  const [didLoginFail, setDidLoginFail] = React.useState(false);

  const { setToken } = React.useContext(JwtTokenContext);

  const handleLogin = React.useCallback(() => {
    setIsLoading(true);
    axios(ENDPOINT_HOME.STAGING + ENDPOINT_PATHS.LOGIN, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        user_id: username,
        password: password,
      },
    }).then(res => {
      setIsLoading(false);
      if (res.data.statusCode == 200) {
        localStorage.setItem('jwt_token', res.data.token);
        if (setToken) setToken(res.data.token);
      }
      else if (res.data.statusCode == 401) {
        setDidLoginFail(true);
      }
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
      setDidLoginFail(true);
    });
  }, [username, password]);

  React.useEffect(() => {
    window.addEventListener('keydown', event => {
      if (event.key === "Enter") handleLogin();
    });

    return () => {
      window.removeEventListener('keydown', event => {
        if (event.key === "Enter") handleLogin();
      });
    };
  }, [handleLogin]);

  return (
    <>
      <img src={Logo} style={{ width: '70%', marginBottom: '0.5rem' }} />
      <div style={{ color: COLORS.PRIMARY, fontFamily: 'Poppins', fontSize: '2.2rem', fontWeight: '600', marginBottom: '10%' }}>Super Dashboard</div>
      <div
        style={{
          fontFamily: 'Poppins',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color: COLORS.PRIMARY,
        }}
      >Login</div>
      <Input
        placeholder="Username"
        style={{ margin: '1rem 0' }}
        onChange={event => setUsername(event.target.value)}
      />
      <Input
        placeholder="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={event => event.preventDefault()}
              onMouseUp={event => event.preventDefault()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        style={{ margin: '1rem 0' }}
        onChange={event => setPassword(event.target.value)}
      />
      <LoadingButton
        type="submit"
        loading={isLoading}
        variant="contained"
        sx={{
          backgroundColor: COLORS.PRIMARY,
          ":hover": {
            backgroundColor: COLORS.PRIMARY,
          },
          marginTop: '0.7rem',
          width: '40%',
          height: '2.5rem',
          textTransform: 'none',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
        onClick={handleLogin}
      >Login</LoadingButton>
      <Alert severity="error" sx={{ visibility: (didLoginFail ? 'visible' : 'hidden') }}>Invalid login. Please check your credentials & try again.</Alert>
    </>
  );
};

const Login: React.FC = () => {
  const { width } = useWindowDimensions();

  if (width > 768) {
    // Return laptop view
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(rgba(237, 98, 55, 0.8), rgba(237, 98, 55, 0.8)), url(${CarroCareWorkshop}) no-repeat`,
          backgroundSize: 'cover, cover',
        }}
      >
        <div
          style={{
            width: '80vw',
            height: '80vh',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '60%',
              display: 'flex',
              alignContent: 'flex-start',
              justifyContent: 'flex-end',
            }}
          >
  
          </div>
          <div
            style={{
              background: COLORS.WHITE,
              boxShadow: '0px 0px 10px 8px rgb(237 98 55 / 80%)',
              width: '40%',
              height: '65%',
              borderRadius: '4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '10% 8%',
              paddingBottom: '10rem',
            }}
          >
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }
  else {
    // Return mobile view
    return (
      <div
        style={{
          background: COLORS.WHITE,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '10%',
            paddingBottom: '8%',
          }}
        >
          <LoginForm />
        </div>
      </div>
    );
  }
};

export default Login;

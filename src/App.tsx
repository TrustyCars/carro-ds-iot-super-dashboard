import axios from 'axios';
import React from 'react';
import Home from './Home';
import Login from './Login';

// the number of available dashboards. this value is used to pad the
// binary representation of status
export const STATUS_PLACES = 5;
export const JwtTokenContext: React.Context<{
  token?: string;
  status?: string;
  setToken?: React.Dispatch<React.SetStateAction<string | null>>
}> = React.createContext({});

function App() {
  // Check if the browser supports service workers. If yes, register a new
  // service worker. If not, log an error.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('worker.js').then(function(registration) {
        console.log('Worker registration successful', registration.scope);
      }, function(err) {
        console.log('Worker registration failed', err);
      }).catch(function(err) {
        console.log(err);
      });
    });
  } else {
    console.log('Service Worker is not supported by browser.');
  }

  // Check localStorage for JWT token. If available, user is logged in.
  // Display home page. If not, display login page.
  const [token, setToken] = React.useState(localStorage.getItem('jwt_token'));

  if (token != null) {
    axios.defaults.headers.common['authorizationToken'] = token;
    return (
      <JwtTokenContext.Provider
        value={{
          token,
          status: JSON.parse(atob(token.split('.')[1])).status.toString(2).padStart(STATUS_PLACES, '0'),
          setToken
        }}
      >
        <Home />
      </JwtTokenContext.Provider>
    );
  }
  else {
    return (
      <JwtTokenContext.Provider value={{ setToken }}>
        <Login />
      </JwtTokenContext.Provider>
    );
  }
}

export default App;

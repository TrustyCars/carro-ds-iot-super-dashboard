import axios from 'axios';
import React from 'react';
import Home from './Home';
import Login from './Login';

export const JwtTokenContext: React.Context<{
  token?: string;
  setToken?: React.Dispatch<React.SetStateAction<string | null>>
}> = React.createContext({});

function App() {
  // Check localStorage for JWT token. If available, user is logged in.
  // Display home page. If not, display login page.
  const [token, setToken] = React.useState(localStorage.getItem('jwt_token'));

 if (token != null) {
    axios.defaults.headers.common['authorizationToken'] = token;
    return (
      <JwtTokenContext.Provider value={{ token, setToken }}>
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

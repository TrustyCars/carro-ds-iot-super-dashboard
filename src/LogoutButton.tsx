import React, { useContext } from 'react';
import { Button } from '@mui/material';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import { COLORS } from './constants';
import { JwtTokenContext } from './App';

const LogoutButton: React.FC = () => {
  const { setToken } = useContext(JwtTokenContext);

  return (
    <Button
      variant="outlined"
      sx={{ border: `1px solid ${COLORS.WHITE}`, ':hover': { border: `1px solid ${COLORS.WHITE}` } }}
      onClick={() => {
        localStorage.removeItem('jwt_token');
        setToken && setToken(null);
      }}
    >
      <LogoutTwoToneIcon fontSize='medium' sx={{ fill: COLORS.WHITE, marginRight: '0.5rem' }} />
      <span style={{ color: COLORS.WHITE, fontSize: '1rem', textTransform: 'none' }}>Logout</span>
    </Button>
  );
};

export default LogoutButton;

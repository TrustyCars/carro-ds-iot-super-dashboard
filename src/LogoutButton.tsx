import React, { useContext } from 'react';
import { Button } from '@mui/material';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import { COLORS } from './constants';
import { JwtTokenContext } from './App';

const LogoutButton: React.FC = () => {
  const { setToken } = useContext(JwtTokenContext);

  return (
    <Button
      variant="text"
      sx={{ minWidth: '2rem', ':hover': { backgroundColor: 'transparent' } }}
      onClick={() => {
        localStorage.removeItem('jwt_token');
        setToken && setToken(null);
      }}
    >
      <LogoutTwoToneIcon fontSize='medium' sx={{ fill: COLORS.WHITE }} />
    </Button>
  );
};

export default LogoutButton;

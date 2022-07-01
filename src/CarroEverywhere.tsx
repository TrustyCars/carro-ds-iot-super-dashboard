import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { COLORS } from './constants';
import VoltageLevel from './VoltageLevel';
import LogoutButton from './LogoutButton';

const CarroEverywhere: React.FC = () => {
  return (
    <>
      <AppBar position='fixed' sx={{ backgroundColor: COLORS.PRIMARY, div: { fontFamily: 'Poppins' } }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Carro Everywhere
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>
      <div
        style={{
          width: '100vw',
          height: '100vh',
        }}
      >
        <VoltageLevel />
      </div>
    </>
  );
};

export default CarroEverywhere;

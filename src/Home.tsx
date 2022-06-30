import React from 'react';
import { AppBar, FormControl, MenuItem, Select, SelectChangeEvent, Toolbar, Typography } from '@mui/material';
import { COLORS } from './constants';
import LogoutButton from './LogoutButton';
import CarroEverywhere from './CarroEverywhere';
import Keypress from './Keypress';

enum DASHBOARDS {
  CARRO_EVERYWHERE = 'CARRO_EVERYWHERE',
  KEYPRESS = 'KEYPRESS'
};

const Home: React.FC = () => {
  const [currDashboard, setCurrDashboard] = React.useState<string>(DASHBOARDS.CARRO_EVERYWHERE);

  return (
    <>
      <AppBar position='fixed' sx={{ backgroundColor: COLORS.PRIMARY, div: { fontFamily: 'Poppins' } }}>
        <Toolbar>
          <FormControl variant="standard" sx={{ m: 1 }}>
            <Select
              value={currDashboard}
              onChange={(event: SelectChangeEvent) => setCurrDashboard(event.target.value)}
              label="Dashboard"
              sx={{
                color: COLORS.WHITE,
                fontSize: '1.2rem',
                "::before": { borderBottom: '1px solid white' },
                "::after": { borderBottom: '1px solid white' },
                ":hover:before": { borderBottom: '3px solid white !important' },
                "svg": { color: COLORS.WHITE },
                "div:focus": { backgroundColor: 'transparent' },
              }}
            >
              <MenuItem value={DASHBOARDS.CARRO_EVERYWHERE}>
                Carro Everywhere
              </MenuItem>
              <MenuItem value={DASHBOARDS.KEYPRESS}>
                Keypress
              </MenuItem>
            </Select>
          </FormControl>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Carro Everywhere
          </Typography> */}
          <div style={{ flexGrow: 1 }} />
          <LogoutButton />
        </Toolbar>
      </AppBar>
      <div
        style={{
          minWidth: '100vw',
          minHeight: '100vh',
        }}
      >
        {currDashboard == DASHBOARDS.CARRO_EVERYWHERE
          && <CarroEverywhere />}

        {currDashboard == DASHBOARDS.KEYPRESS
          && <Keypress />}
      </div>
    </>
  );
};

export default Home;

import React from 'react';
import axios from 'axios';
import { AppBar, FormControl, MenuItem, Select, SelectChangeEvent, Toolbar } from '@mui/material';
import { COLORS } from './constants';
import LogoutButton from './LogoutButton';
import CarroEverywhere from './CarroEverywhere';
import FleetManagement from './FleetManagement';
import Keypress from './Keypress';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DeviceList from './FleetManagement/deviceList';
import Device from './FleetManagement/device';

enum DASHBOARDS {
  CARRO_EVERYWHERE = 'CARRO_EVERYWHERE',
  FLEET_MANAGEMENT = 'FLEET_MANAGEMENT',
  KEYPRESS = 'KEYPRESS',
};

const getHomeElement = (currDashboard: string) => {
  switch (currDashboard) {
    case DASHBOARDS.CARRO_EVERYWHERE:
      return <CarroEverywhere />;
    case DASHBOARDS.FLEET_MANAGEMENT:
      axios.defaults.headers.common['authorizationToken'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJET05UX1RPVUNIX1RISVNfVVNFUiIsInN0YXR1cyI6MSwiZXhwIjoxNjg3ODU3Nzg2LCJpYXQiOjE2NTYzMjE3ODZ9.-V3NczLxdfoYMHCcAxcd-IljdvfNE6lqJzgyHrm4Yb8";
      return <FleetManagement />;
    case DASHBOARDS.KEYPRESS:
      return <Keypress />;
  }
};

const Home: React.FC = () => {
  const [currDashboard, setCurrDashboard] = React.useState<string>(DASHBOARDS.FLEET_MANAGEMENT);

  return (
    <>
      <AppBar position='fixed' sx={{ backgroundColor: COLORS.PRIMARY, div: { fontFamily: 'Poppins' } }}>
        <Toolbar>
          <FormControl variant="standard" sx={{ m: 1 }}>
            <Select
              value={currDashboard}
              onChange={(event: SelectChangeEvent) => {
                console.log("select changed")
                setCurrDashboard(event.target.value)
              }}
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
              <MenuItem value={DASHBOARDS.FLEET_MANAGEMENT}>
                Fleet Management
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
          paddingTop: '4rem',
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={getHomeElement(currDashboard)} />
            { currDashboard == DASHBOARDS.FLEET_MANAGEMENT &&
              <Route path='devices' element={<DeviceList />} />
            }
            { currDashboard == DASHBOARDS.FLEET_MANAGEMENT &&
              <Route path='device/:id' element={<Device />} />
            }
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default Home;

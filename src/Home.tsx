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
const DEFAULT_DASHBOARD = DASHBOARDS.FLEET_MANAGEMENT;

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

const splitQueryString = (search: string) => (search.slice(1).split('&'));
const getCurrentDashboard = (search: string) => {
  if (!search) {
    window.location.search = `dashboard=${DEFAULT_DASHBOARD}`;
    return DEFAULT_DASHBOARD;
  }
  else return (
    splitQueryString(search)[splitQueryString(search).findIndex(v => v.slice(0, 9) === 'dashboard')].slice(10)
  );
};

const Home: React.FC = () => {
  const dashboard = React.useRef<string>(getCurrentDashboard(window.location.search));

  return (
    <>
      <AppBar position='fixed' sx={{ backgroundColor: COLORS.PRIMARY, div: { fontFamily: 'Poppins' } }}>
        <Toolbar>
          <FormControl variant="standard" sx={{ m: 1 }}>
            <Select
              value={dashboard.current}
              onChange={(event: SelectChangeEvent) => {
                const qs_arr = window.location.search.slice(1).split('&');
                qs_arr[qs_arr.findIndex(v => v.slice(0, 9) === 'dashboard')] = `dashboard=${event.target.value}`;

                window.location.href = `/?${qs_arr.join('&')}`;

                dashboard.current = event.target.value;
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
            <Route path='/' element={getHomeElement(dashboard.current)} />
            { dashboard.current === DASHBOARDS.FLEET_MANAGEMENT &&
              <Route path='devices' element={<DeviceList />} />
            }
            { dashboard.current === DASHBOARDS.FLEET_MANAGEMENT &&
              <Route path='device/:id' element={<Device />} />
            }
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default Home;

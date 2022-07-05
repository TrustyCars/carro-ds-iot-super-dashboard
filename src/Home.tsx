import React from 'react';
import axios from 'axios';
import {
  AppBar,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar
} from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { JwtTokenContext, STATUS_PLACES } from './App';
import { COLORS } from './constants';
import LogoutButton from './LogoutButton';
import CarroEverywhere from './CarroEverywhere';
import FleetManagement from './FleetManagement';
import Keypress from './Keypress';
import InvalidDashboard from './InvalidDashboard';
import DeviceList from './FleetManagement/deviceList';
import Device from './FleetManagement/device';

enum DASHBOARDS {
  CARRO_EVERYWHERE = 'CARRO_EVERYWHERE',
  FLEET_MANAGEMENT = 'FLEET_MANAGEMENT',
  KEYPRESS = 'KEYPRESS',
};

const getHomeElement = (currDashboard: string, userDashboards: string[]) => {
  if (userDashboards.findIndex(d => d === currDashboard) === -1) {
    // User is trying to access a dashboard that doesn't exist or one that they
    // do not have access to. Display error page.
    return <InvalidDashboard />;
  }

  switch (currDashboard) {
    case DASHBOARDS.CARRO_EVERYWHERE:
      return <CarroEverywhere />;
    case DASHBOARDS.FLEET_MANAGEMENT:
      return <FleetManagement />;
    case DASHBOARDS.KEYPRESS:
      return <Keypress />;
  }
};

const splitQueryString = (search: string) => (search.slice(1).split('&'));
const getCurrentDashboard = (search: string, defaultDashboard: string) => {
  if (!search) {
    window.location.search = `dashboard=${defaultDashboard}`;
    return defaultDashboard
  }
  else return (
    splitQueryString(search)[splitQueryString(search).findIndex(v => v.slice(0, 9) === 'dashboard')].slice(10)
  );
};

const Home: React.FC = () => {
  const { token, status } = React.useContext(JwtTokenContext);

  const dashboard = React.useRef<string>('');

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [userDashboards, setUserDashboards] = React.useState<{
    dashboard: DASHBOARDS;
    element: JSX.Element;
  }[]>([]);

  React.useEffect(() => {
    axios.defaults.headers.common['authorizationToken'] = token || '';
  }, []);

  React.useEffect(() => {
    const tempUserDashboards = [];
    if (status) {
      if (parseInt(status[STATUS_PLACES-1])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.FLEET_MANAGEMENT,
          element:(<MenuItem value={DASHBOARDS.FLEET_MANAGEMENT}>
                      Fleet Management
                   </MenuItem>)
        });
      };

      if (parseInt(status[STATUS_PLACES-2])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.KEYPRESS,
          element: (<MenuItem value={DASHBOARDS.KEYPRESS}>
                      Keypress
                    </MenuItem>)
        });
      };

      if (parseInt(status[STATUS_PLACES-3])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.CARRO_EVERYWHERE,
          element: (<MenuItem value={DASHBOARDS.CARRO_EVERYWHERE}>
                      Carro Everywhere
                    </MenuItem>)
        });
      }

      setUserDashboards(tempUserDashboards);
    }
  }, [status]);

  React.useEffect(() => {
    if (userDashboards.length > 0) {
      dashboard.current = getCurrentDashboard(window.location.search, userDashboards[0].dashboard);
      setIsLoading(false);
    }
  }, [userDashboards]);

  if (isLoading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  else {
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
                {userDashboards.map(d => d.element)}
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
              <Route path='/' element={getHomeElement(dashboard.current, userDashboards.map(d => d.dashboard))} />
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
  }
};

export default Home;

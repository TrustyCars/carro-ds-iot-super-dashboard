import React from 'react';
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
import SalesPod from './SalesPod';
import IotAdmin from './IotAdmin';

enum DASHBOARDS {
  CARRO_EVERYWHERE = 'CARRO_EVERYWHERE',
  FLEET_MANAGEMENT = 'FLEET_MANAGEMENT',
  KEYPRESS = 'KEYPRESS',
  SALES_POD = 'SALES_POD',
  IOT_ADMIN = 'IOT_ADMIN',
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
    case DASHBOARDS.SALES_POD:
      return <SalesPod />;
    case DASHBOARDS.IOT_ADMIN:
      return <IotAdmin />;
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
  const { status } = React.useContext(JwtTokenContext);

  const dashboard = React.useRef<string>('');

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [userDashboards, setUserDashboards] = React.useState<{
    dashboard: DASHBOARDS;
    element: JSX.Element;
  }[]>([]);

  React.useEffect(() => {
    const tempUserDashboards = [];
    if (status) {
      if (parseInt(status[STATUS_PLACES-1])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.FLEET_MANAGEMENT,
          element:(<MenuItem key={DASHBOARDS.FLEET_MANAGEMENT} value={DASHBOARDS.FLEET_MANAGEMENT}>
                      Fleet Management
                   </MenuItem>)
        });
      };

      if (parseInt(status[STATUS_PLACES-2])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.KEYPRESS,
          element: (<MenuItem key={DASHBOARDS.KEYPRESS} value={DASHBOARDS.KEYPRESS}>
                      Keypress
                    </MenuItem>)
        });
      };

      if (parseInt(status[STATUS_PLACES-3])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.CARRO_EVERYWHERE,
          element: (<MenuItem key={DASHBOARDS.CARRO_EVERYWHERE} value={DASHBOARDS.CARRO_EVERYWHERE}>
                      Carro Everywhere
                    </MenuItem>)
        });
      }

      if (parseInt(status[STATUS_PLACES-4])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.SALES_POD,
          element: (<MenuItem key={DASHBOARDS.SALES_POD} value={DASHBOARDS.SALES_POD}>
                      Sales Pod
                    </MenuItem>)
        });
      }

      if (parseInt(status[STATUS_PLACES-5])) {
        tempUserDashboards.push({
          dashboard: DASHBOARDS.IOT_ADMIN,
          element: (<MenuItem key={DASHBOARDS.IOT_ADMIN} value={DASHBOARDS.IOT_ADMIN}>
                      IoT Admin
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
            <div style={{ flexGrow: 1 }} />
            <LogoutButton />
          </Toolbar>
        </AppBar>
        <div
          style={{
            display: 'flex',
            boxSizing: 'border-box',
            minWidth: '100vw',
            minHeight: '100vh',
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

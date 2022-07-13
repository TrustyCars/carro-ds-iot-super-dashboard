import React from 'react';
import axios from 'axios';
import { CircularProgress, Divider, Stack, TextField } from '@mui/material';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from './constants';
import useWindowDimensions from './hooks/useWindowDimensions';
import VehicleListItem from './SmartKeypress/VehicleListItem';

export type KeypressDeviceProps = {
  DEVICE_ID: string;
  CARPLATE_NO: string;
  PERMISSION: string;
  EXPIRY_DATE: number | null;
  KEYPRESS: number;
};

export type UserProps = {
  USER_ID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
};

const Keypress: React.FC = () => {
  const { width } = useWindowDimensions();

  const [devices, setDevices] = React.useState<KeypressDeviceProps[]>([]);
  const [filteredDevices, setFilteredDevices] = React.useState<KeypressDeviceProps[]>([]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [users, setUsers] = React.useState<UserProps[]>([]);

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.GET_USER_DEVICES)
      .then(res => {
        setDevices(res.data.body);
        setFilteredDevices(res.data.body);
        setIsLoading(false);
      });

    axios.get(ENDPOINT_HOME.STAGING + ENDPOINT_PATHS.GET_USERS, {
      params: { status: 2 }
    }).then(res => {
      setUsers(res.data.body);
    });
  }, []);

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        padding: (width < 768 ? '0' : '0 15%'),
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: '3rem 1rem 0 1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            marginBottom: '0.7rem',
            marginLeft: '0.1rem',
            color: '#999',
          }}
        >Search for a car</div>
        <TextField
          label="Carplate Number"
          variant="outlined"
          sx={{
            width: '100%',
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilteredDevices(devices.filter(d => {
              return (d.CARPLATE_NO.toLowerCase().includes(event.target.value.toLowerCase()));
            }));
          }}
        />
        <div
          style={{
            marginBottom: '0.5rem',
            marginTop: '3rem',
            marginLeft: '0.1rem',
            color: '#999',
          }}
        >Search results</div>
        <div style={{ flexGrow: 1, height: '60vh', overflowY: 'scroll' }}>
          <Stack
            spacing={2}
            divider={<Divider orientation="horizontal" flexItem />}
            sx={{ marginTop: '0.5rem' }}
          >
            {isLoading
              ? <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
              : (filteredDevices.length
                  ? filteredDevices.map((d, i) => (
                      <VehicleListItem key={i} device={d} users={users} />
                    ))
                  : <div style={{ textAlign: 'center', marginTop: '3rem' }}>Couldn't find any results 🧐<br />Please try again.</div>
              )
            }
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Keypress;

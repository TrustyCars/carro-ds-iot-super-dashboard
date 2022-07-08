import React from 'react';
import axios from 'axios';
import { Card, CardContent, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from './constants';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';

type KeypressDeviceProps = {
  DEVICE_ID: string;
  CARPLATE_NO: string;
  PERMISSION: string;
  EXPIRY_DATE: number | null;
  KEYPRESS: number;
};

const Keypress: React.FC = () => {
  const [devices, setDevices] = React.useState<KeypressDeviceProps[]>([]);
  const [filteredDevices, setFilteredDevices] = React.useState<KeypressDeviceProps[]>([]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.GET_USER_DEVICES)
      .then(res => {
        setDevices(res.data.body);
        setFilteredDevices(res.data.body);
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
        <div style={{ height: '50vh', overflowY: 'scroll' }}>
          {isLoading
            ? <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
            : (filteredDevices.length
                ? filteredDevices.map(d => (
                    <Card variant="outlined" sx={{ marginBottom: '1rem' }}>
                      <CardContent sx={{ paddingBottom: '16px !important', paddingLeft: '24px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <Chip color='default' label={d.PERMISSION} sx={{ textTransform: 'lowercase', fontSize: '0.8rem', marginBottom: '0.3rem' }} />
                            <Typography variant="h5" component="div">
                              {d.CARPLATE_NO}
                            </Typography>
                            <Typography>
                              Keypress: <span style={{ fontWeight: 'bold' }}>{d.KEYPRESS}</span>
                            </Typography>
                          </div>
                          <LockOpenRoundedIcon sx={{ fill: '#8BBD56', marginRight: '0.5rem' }} fontSize='large' />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : <div style={{ textAlign: 'center', marginTop: '3rem' }}>Couldn't find any results 🧐<br />Please try again.</div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Keypress;

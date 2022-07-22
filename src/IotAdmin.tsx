import React from 'react';
import axios from 'axios';
import { AlertColor, Paper, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useWindowDimensions from './hooks/useWindowDimensions';
import { isDesktop } from './utils/utils';
import { COLORS, ENDPOINT_HOME, ENDPOINT_PATHS } from './constants';
import Snackbar from './Snackbar';

const IotAdmin = () => {
  const { width } = useWindowDimensions();

  const [deviceGroup, setDeviceGroup] = React.useState<string>('1');
  const [smsNumber, setSmsNumber] = React.useState<string>('');
  const [bleMacAddress, setBleMacAddress] = React.useState<string>('');

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarInfo, setSnackbarInfo] = React.useState<{ status: AlertColor; message: string; }>({
    status: 'success',
    message: 'Create success!',
  });

  return (
    <div
      style={{
        padding: '2%',
      }}
    >
      <Snackbar
        keepOpen
        status={snackbarInfo.status}
        message={snackbarInfo.message}
        isSnackbarOpen={isSnackbarOpen}
        setIsSnackbarOpen={setIsSnackbarOpen}
      />
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          paddingRight: '10%',
          width: (isDesktop(width) ? '30vw' : '85vw'),
        }}
      >
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >Create a new device</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            label='SMS Number'
            variant='standard'
            required
            type='number'
            sx={{
              marginBottom: '0.7rem',
            }}
            value={smsNumber}
            onChange={event => setSmsNumber(event.target.value)}
          />
          <TextField
            label='Group Number'
            variant='standard'
            required
            type='number'
            sx={{
              marginBottom: '0.7rem',
            }}
            value={deviceGroup}
            onChange={event => setDeviceGroup(event.target.value)}
          />
          <TextField
            label='BLE MAC Address'
            variant='standard'
            required
            sx={{
              marginBottom: '0.7rem',
            }}
            value={bleMacAddress}
            onChange={event => setBleMacAddress(event.target.value)}
          />
          <LoadingButton
            loading={isLoading}
            sx={{
              marginTop: '1.5rem',
              color: COLORS.PRIMARY,
            }}
            onClick={() => {
              // Validate inputs
              if (smsNumber === ''
                  || deviceGroup === ''
                  || bleMacAddress === '') {
                setSnackbarInfo({
                  status: 'error',
                  message: 'Required field(s) are not filled in. Please try again.',
                });
                setIsSnackbarOpen(true);
                return;
              }
              else {
                setIsLoading(true);
                axios.post(ENDPOINT_HOME.STAGING + ENDPOINT_PATHS.DEVICE_INIT, {
                  device_grp: parseInt(deviceGroup),
                  sms: smsNumber,
                  ble_address: bleMacAddress,
                })
                  .then(res => {
                    if (res.data.statusCode === 200) {
                      setSnackbarInfo({
                        status: 'success',
                        message: `Create success! Your new device's ID is: ${res.data.body.device_id}`,
                      });

                      setSmsNumber('');
                      setDeviceGroup('1');
                      setBleMacAddress('');
                    }
                    else {
                      setSnackbarInfo({
                        status: 'error',
                        message: `Create failed. ${res.data.body}`,
                      });
                    }
                    setIsSnackbarOpen(true);
                    setIsLoading(false);
                  });
              }
            }}
          >
            Create
          </LoadingButton>
        </div>
      </Paper>
    </div>
  );
};

export default IotAdmin;

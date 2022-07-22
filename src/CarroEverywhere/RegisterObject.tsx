import React from 'react';
import axios from 'axios';
import {
  AlertColor,
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { COLORS, ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { isDesktop } from '../utils/utils';
import RegisterKeyCard from './RegisterKeyCard';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../Snackbar';

type VehicleDeviceProps = {
  DEVICE_ID: string;
  CARPLATE_NO: string;
};

type RegisterObjectProps = {
  visible: boolean;
};

const RegisterObject: React.FC<RegisterObjectProps> = ({
  visible
}) => {
  const { width } = useWindowDimensions();

  const [vehicleValue, setVehicleValue] = React.useState('register');
  const [carPlateNumber, setCarPlateNumber] = React.useState<string>('');

  const [selectedDevice, setSelectedDevice] = React.useState<(VehicleDeviceProps & { label: string; linked: boolean })>();
  const [deviceAutocompleteKey, setDeviceAutocompleteKey] = React.useState<number>((new Date()).getTime());

  const [additionalKeys, setAdditionalKeys] = React.useState<{ index: number, element: React.ReactElement}[]>([]);
  const [keyValue, setKeyValue] = React.useState();

  const [vehicles, setVehicles] = React.useState<string[]>([]);
  const [devices, setDevices] = React.useState<(VehicleDeviceProps & { label: string; linked: boolean })[]>([]);

  const [isSubmittingForm, setIsSubmittingForm] = React.useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarInfo, setSnackbarInfo] = React.useState<{ status: AlertColor; message: string; }>({
    status: 'success',
    message: 'Register success!',
  });

  const keysRef = React.useRef(Array(0));

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.GET_VEHICLES)
      .then(res => {
        setVehicles(res.data.body.map(((v: VehicleDeviceProps) => v.CARPLATE_NO)));
      });
    
    axios.get(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.GET_DEVICES)
      .then(res => {
        setDevices(
          res.data.body.map((d: VehicleDeviceProps) => ({ ...d, label: d.DEVICE_ID, linked: (d.CARPLATE_NO === null) }))
        );
      });
  }, []);

  return (
    <div
      style={{
        display: (visible ? 'block' : 'none'),
        marginRight: '2rem',
        width: (isDesktop(width) ? '50vw' : '87vw'),
        boxSizing: 'content-box',
      }}
    >
      <Paper elevation={3} sx={{ padding: '10%', paddingBottom: '5rem' }}>
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >Register or link to an existing object</div>
        <div
          style={{
            fontSize: '1.1rem',
            marginTop: '1rem',
          }}
        >Vehicle</div>
        <div
          style={{
            fontSize: '0.9rem',
            color: COLORS.GREY,
          }}
        >Required.</div>
        <FormControl>
          <RadioGroup
            row
            defaultValue='register'
            value={vehicleValue}
            onChange={event => setVehicleValue(event.target.value)}
          >
            <FormControlLabel value='register' control={<Radio />} label="Register new" />
            <FormControlLabel value='link' control={<Radio />} label="Link to existing" />
          </RadioGroup>
        </FormControl>
        {vehicleValue === 'register'
          ? <div>
              <TextField
                label='Car plate number'
                variant='standard'
                required
                sx={{ width: (isDesktop(width) ? '50%' : '100%'), }}
                value={carPlateNumber}
                onChange={event => setCarPlateNumber(event.target.value)}
              />
            </div>
          : <Autocomplete
              disablePortal
              options={vehicles}
              onChange={(_event, newValue) => newValue && setCarPlateNumber(newValue)}
              renderInput={(params) => 
                <TextField
                  {...params}
                  label='Search for a car plate number'
                  variant='standard'
                  required
                  sx={{ width: (isDesktop(width) ? '50%' : '100%'), }}
                />
              }
            />
        }

        <div
          style={{
            fontSize: '1.1rem',
            marginTop: '2rem',
          }}
        >Device</div>
        <div
          style={{
            fontSize: '0.9rem',
            color: COLORS.GREY,
          }}
        >
          {vehicleValue === 'link'
            ? "Optional. If left empty, we'll assume the vehicle remains linked \
                to the current device already linked to it. If filled, the vehicle's \
                device will switch to the new one."
            : "Required."
          }
        </div>
        <FormControl>
          <RadioGroup
            row
            defaultValue='link'
          >
            <FormControlLabel value='link' control={<Radio />} label="Link to existing" />
          </RadioGroup>
        </FormControl>
        <Autocomplete
          key={deviceAutocompleteKey}
          disablePortal
          options={devices}
          value={selectedDevice}
          onChange={(_event, newValue) => newValue && setSelectedDevice(newValue)}
          renderInput={(params) => 
            <TextField
              {...params}
              label='Search for a device ID'
              variant='standard'
              required
              sx={{ width: (isDesktop(width) ? '50%' : '100%'), }}
            />
          }
        />

        <div
          style={{
            fontSize: '1.1rem',
            marginTop: '2rem',
          }}
        >Key</div>
        <div
          style={{
            fontSize: '0.9rem',
            color: COLORS.GREY,
          }}
        >
          {vehicleValue === 'link'
            ? 'Required.'
            : "Optional. You can choose to register the vehicle's key(s) now or to \
               come back & register a vehicle's key(s) when they become available."
          }
        </div>
        <FormControl>
          <RadioGroup
            row
            defaultValue='register'
          >
            <FormControlLabel value='register' control={<Radio />} label="Register new" />
          </RadioGroup>
        </FormControl>
        <RegisterKeyCard ref={(element: any) => element && keysRef?.current?.splice(0, 1, element)} />
        {additionalKeys.map(k => k.element)}
        <Button
          variant='contained'
          onClick={() => {
            const newId = additionalKeys.length ? additionalKeys[additionalKeys.length - 1].index + 1 : 1;
            setAdditionalKeys([...additionalKeys, {
              index: newId,
              element: <RegisterKeyCard isClearable ref={(element: any) => element && keysRef?.current?.splice(newId, 1, element)}
                key={newId} onClear={() => {
                setAdditionalKeys(prevAdditionalKeys => prevAdditionalKeys.filter(k => k.index !== newId ))
              }} />,
            }])
          }}
          sx={{
            marginTop: '0.7rem',
            width: '100%',
            background: COLORS.LIGHTGREY,
            color: COLORS.BLACK,
            textTransform: 'none',
            fontSize: '1rem',
            padding: '0.5rem 0',
            ":hover": {
              background: COLORS.LIGHTGREY,
            },
          }}
        >Add another key</Button>

        <LoadingButton
          variant='text'
          loading={isSubmittingForm}
          onClick={() => {
            setIsSubmittingForm(true);
            
            // Validate inputs
            if (carPlateNumber === ''
                || (vehicleValue === 'register' && (selectedDevice === undefined || selectedDevice.DEVICE_ID === ''))) {
              setSnackbarInfo({
                status: 'error',
                message: 'Cannot submit form. Required fields are not filled up. Please try again.',
              });
              setIsSubmittingForm(false);
              setIsSnackbarOpen(true);
              return;
            }

            axios.post(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.REGISTER_VEHICLES_AND_KEYS, {
              vehicle: {
                isRegister: (vehicleValue === 'register'),
                carplate_no: carPlateNumber,
              },
              device: selectedDevice?.DEVICE_ID,
              keys: keysRef.current.map(r => r.getData()),
            }).then(res => {
              if (res.data.statusCode === 200) {
                setIsSnackbarOpen(true);

                // Reset form values
                setVehicleValue('register');
                setCarPlateNumber('');

                setSelectedDevice(undefined);
                setDeviceAutocompleteKey((new Date()).getTime());

                setAdditionalKeys([]);
                keysRef.current = keysRef.current.slice(0, 1);
                keysRef.current[0].reset();
              }
              else {
                setSnackbarInfo({
                  status: 'error',
                  message: `Register failed. ${res.data.body}`,
                });
                setIsSnackbarOpen(true);
              }
              setIsSubmittingForm(false);
            });
          }}
          sx={{
            float: 'right',
            margin: '2rem 0 0 1rem',
            padding: '0.5rem 1.5rem',
            backgroundColor: COLORS.PRIMARY,
            color:COLORS.WHITE,
            ":hover": {
              backgroundColor: COLORS.PRIMARY,
            },
          }}
        >
          Submit
        </LoadingButton>
        <Snackbar
          status={snackbarInfo.status}
          message={snackbarInfo.message}
          isSnackbarOpen={isSnackbarOpen}
          setIsSnackbarOpen={setIsSnackbarOpen}
        />
      </Paper>
    </div>
  );
};

export default RegisterObject;

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './deviceList.css';
import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel
} from '@mui/material';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import Header from './header';
import strftime from '../utils/strftime';
import useWindowDimensions from '../hooks/useWindowDimensions';

type DeviceProps = {
  DEVICE_ID: string;
  CARPLATE_NO: string;
  VOLTAGE: string;
  DEVICE_TS: string;
  show: boolean;
};

const LOW_VOLTAGE_THRESHOLD = 12;
const VoltageChip: React.FC<{ voltage: number }> = ({ voltage }) => {
  let chipLabel = 'OK Battery';
  let chipColor: 'success' | 'error' | 'warning' = 'success';

  if (voltage === 0) {
    chipLabel = 'Dead Battery';
    chipColor = 'error';
  }
  else if (voltage < LOW_VOLTAGE_THRESHOLD) {
    chipLabel = 'Low Battery';
    chipColor = 'warning';
  }

  return (
    <Chip
      label={`${chipLabel} - ${voltage}V`}
      color={chipColor}
      style={{ marginBottom: '0.4rem', fontSize: '0.75rem', height: '28px' }}
    />
  );
};

// Used for sorting devices - given a voltage, will return
// -- 2 if OK Battery
// -- 1 if Low Battery
// -- 0 if Dead Battery
const getBatteryStatusNumericValue = (voltage: number) => {
  if (voltage === 0) return 0;
  else if (voltage < LOW_VOLTAGE_THRESHOLD) return 1;
  else return 2;
};

function DeviceList() {
  const { width } = useWindowDimensions();

  const [devices, setDevices] = useState<DeviceProps[]>([]);
  const [isDevicesLoading, setIsDevicesLoading] = useState(true);
  const navigate = useNavigate();

  const [currDeviceFilter, setCurrDeviceFilter] = useState<{ dead: boolean; low: boolean; ok: boolean }>({
    dead: true,
    low: true,
    ok: true,
  });

  const populateDeviceWithShow = (device: DeviceProps) => {
    if ((currDeviceFilter.dead && parseFloat(device.VOLTAGE) === 0)
      || (currDeviceFilter.low && parseFloat(device.VOLTAGE) <= LOW_VOLTAGE_THRESHOLD)
      || (currDeviceFilter.ok && parseFloat(device.VOLTAGE) > LOW_VOLTAGE_THRESHOLD)) {
      return { ...device, show: true };
    }
    else return { ...device, show: false };
  };
      
  useEffect(()=>{
    // Get devices
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.DEVICE_LIST).then(res => {
      res.data.body && setDevices(res.data.body.map((device: DeviceProps) => populateDeviceWithShow(device)));
      setIsDevicesLoading(false);
    }).catch(err => console.log(err));
  }, []);

  useEffect(() => {
    setDevices(devices.map(device => populateDeviceWithShow(device)));
  }, [JSON.stringify(currDeviceFilter)]);

  const handleDeviceFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrDeviceFilter({
      ...currDeviceFilter,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <>
      <Header />
      <div
        className="device-page-container"
        style={{
          padding: `7rem ${width < 768 ? '4%' : '10%'} 0 ${width < 768 ? '4%' : '10%'}`,
          flexGrow: 1,
        }}
      >
      <Card sx={{ mx: '1rem', background: '#fbfbfb', pb: '0' }}>
        <CardContent>
         <div className='title'>Devices</div>
        </CardContent>
      </Card>
      <div
        style={{
          display: 'flex',
          flexDirection: (width < 600 ? 'column-reverse' : 'row'),
        }}
      >
        <div className="device-list-container">
          {isDevicesLoading
            ? <div className='loader-container'><CircularProgress /></div>
            : (devices.filter(device => device.show).length
                ? devices.filter(device => device.show).sort((a, b) => {
                    if (getBatteryStatusNumericValue(parseFloat(a.VOLTAGE)) === getBatteryStatusNumericValue(parseFloat(b.VOLTAGE))) {
                      return parseInt(a.DEVICE_TS) - parseInt(b.DEVICE_TS);
                    }
                    else {
                      return getBatteryStatusNumericValue(parseFloat(a.VOLTAGE)) - getBatteryStatusNumericValue(parseFloat(b.VOLTAGE));
                    }
                  })
                  .map((x: DeviceProps, idx: number) => {
                    if (x.DEVICE_ID) {
                      return (
                        <Card
                          key={idx}
                          className='device-card'
                          onClick={() => navigate(`/device/${x.DEVICE_ID}${window.location.search}`)}
                          sx={{ m: '1rem', p: '0.75rem', pt: '0', width: (width < 1200 ? (width < 768 ? '90%' : '38%') : '26%') }}>
                          <CardContent>
                            <h1 style={{ marginBottom: 0 }}>{x.CARPLATE_NO}</h1>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                              }}
                            >
                              <VoltageChip voltage={parseFloat(x.VOLTAGE)} />
                              <Chip
                                label={`Last updated: ${strftime('%e %b, %k:%M', new Date(parseInt(x.DEVICE_TS) * 1000))}`}
                                sx={{ "span": { whiteSpace: 'break-spaces' }, minHeight: '28px', marginBottom: '0.5rem', fontSize: '0.75rem' }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  })
                : <div
                    style={{ margin: '1rem', padding: '0.75rem 10%', paddingTop: '0', flexGrow: 1 }}
                  >
                    <div style={{ fontSize: '4rem', lineHeight: '4rem', textAlign: 'center', marginTop: '1rem' }}>😯</div>
                    <h3 style={{ margin: 0, fontWeight: 500, textAlign: 'center' }}>Oops! Your filters don't match any results. Try a different filter?</h3>
                  </div>
              )
            }
        </div>
        <div
          style={{
            minWidth: '17%',
            marginTop: '1rem',
            marginLeft: (width < 600 ? '1rem' : 0),
          }}
        >
          <FormControl component="fieldset" variant="standard">
            <FormLabel
              component="legend"
              sx={{
                ":focus": { color: 'rgba(0, 0, 0, 0.6)' }
              }}
            >Filter devices</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked onChange={handleDeviceFilterChange} name='dead' />}
                  label="Dead Battery"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked onChange={handleDeviceFilterChange} name='low' />}
                  label="Low Battery"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked onChange={handleDeviceFilterChange} name='ok' />}
                  label="OK Battery"
                />
              </FormGroup>
          </FormControl>
        </div>
      </div>
    </div>
    </>
  );
}

export default DeviceList;

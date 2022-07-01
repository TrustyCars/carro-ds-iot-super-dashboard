import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './deviceList.css';
import { Card, CardContent, CircularProgress } from '@mui/material';
import VoltageCard from './voltage';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import Header from './header';

type DeviceProps = {
  DEVICE_ID: string;
  VOLTAGE: string;
};

function DeviceList() {
  const [devices, setDevices] = useState<DeviceProps[]>([]);
  const [isDevicesLoading, setIsDevicesLoading] = useState(true);
  const navigate = useNavigate();
      
  useEffect(()=>{
    // Get devices
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.DEVICE_LIST).then(res => {
        console.log(res)
        res.data.body && setDevices(res.data.body);
        setIsDevicesLoading(false);
    }).catch(err => console.log(err));
  }, []);

  return (
    <>
      <Header />
      <div className="device-page-container">
      <Card sx={{ mx: '1rem', background: '#fbfbfb', pb: '0' }}>
        <CardContent>
         <div className='title'>Devices</div>
        </CardContent>
      </Card>
      <div className="device-list-container">
        {isDevicesLoading
          ? <div className='loader-container'><CircularProgress /></div>
          : devices.map((x: DeviceProps, idx: number) => {
              if (x.DEVICE_ID) {
                return (
                  <Card
                    key ={idx}
                    className='device-card'
                    onClick={() => navigate(`/device/${x.DEVICE_ID}${window.location.search}`)}
                    sx={{ m: '1rem', p: '0.75rem', pt: '0', width: '25%' }}>
                    <CardContent>
                      <h1>{x.DEVICE_ID}</h1>
                      <VoltageCard currentVoltage={parseFloat(x.VOLTAGE)} loading={false} />
                    </CardContent>
                  </Card>
                );
              }
            })}
      </div>
    </div>
    </>
  );
}

export default DeviceList;

import './device.css';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import VoltageCard from './voltage';
import IdCard from './id';
import VoltageTimeSeriesCard, { subtractTime } from './voltageTimeSeries';
import VehicleSpeedTimeSeries from './vehicleSpeedTimeSeries';
import EntitiesCard from './entities';
import CoordinatesAndTripsCard from './coordinatesAndTrips';
import './deviceInfoCardStyles.css';
import { ENDPOINT_HOME, ENDPOINT_PATHS, PID_MAPPINGS } from '../constants';
import Header from './header';
import { defaultTimePeriod } from './timePeriodSelect';

type VoltageProps = {
  SERVER_DATETIME: string;
  VOLTAGE?: string;
};

type CANProps = {
  [key: string]: string;
};

export type ChartDataProps = {
  x: number;
  y: number;
};

type PositionProps = {
  DEVICE_ID: string;
  GPS_LAT: string;
  GPS_LONG: string;
  SERVER_DATETIME: string;
};

function Device() {
  const { id } = useParams();

  const speedArr = React.useRef<ChartDataProps[]>([]);
  const voltageArr = React.useRef<ChartDataProps[]>([]);
  const tripArr = React.useRef<{
    GPS_LAT: string;
    GPS_LONG: string;
    SERVER_DATETIME:string;
    DEVICE_ID:string;
    
    }[][]>([]);

  const fullCanData = React.useRef<{ [key: string]: string }[]>([]);

  const carPlate = React.useRef<string>('');
  const position = React.useRef<{ lat: number; long: number; time: Date }>();

  const [isVoltageLoading, setIsVoltageLoading] = React.useState<boolean>(true);
  const [isSpeedLoading, setIsSpeedLoading] = React.useState<boolean>(true);
  const [isCanDataLoading, setIsCanDataLoading] = React.useState<boolean>(true);
  const [isTripDataLoading, setIsTripDataLoading] = React.useState<boolean>(true);

  const getDeviceInfo = (startDate: number) => {
    // Get latest position
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.LATEST_POSITIONS).then(res => {
      res.data.body.map((d: PositionProps) => {
        if (d.DEVICE_ID == id) {
          position.current = {
            lat: parseFloat(d.GPS_LAT),
            long: parseFloat(d.GPS_LONG),
            time: new Date(d.SERVER_DATETIME),
          };
        }
      });
    }).catch()

    // Get device info
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.DEVICE_INFO, {
      params: {
        device_id: id,
        start_date: startDate
      }
    }).then((res)=>{
      carPlate.current = res.data.body.CARPLATE_NO.CARPLATE_NO;

      // Processing vehicle speed data to get data for vehicle speed time series
      const newSpeedArr = res.data.body.CAN.reduce((prev: ChartDataProps[], curr: CANProps) => {
        if (curr[PID_MAPPINGS.VEHICLE_SPEED] != null) prev.push({
          // The multiplication is necessary because curr.DEVICE_TS is a unix timestamp in seconds,
          // while the js Date() function expects a unix timestamp in milliseconds.
          x: parseInt(curr.DEVICE_TS)*1000,
          y: parseFloat(curr[PID_MAPPINGS.VEHICLE_SPEED]),
        });
        return prev;
      }, []);
      speedArr.current = newSpeedArr;
      setIsSpeedLoading(false);

      fullCanData.current = res.data.body.CAN;
      setIsCanDataLoading(false);
    })
  };

  const getDeviceSpeed = (startDate: number, endDate?: number, sample?: boolean): void => {
    setIsSpeedLoading(true);
    const params = {
      device_id: id,
      start_date: startDate,
      end_date: endDate,
      pid: PID_MAPPINGS.VEHICLE_SPEED,
      ...(sample != false && { sample: 'True' })
    };
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.DEVICE_INFO, {
      params
    }).then((res)=>{
      // Processing vehicle speed data to get data for vehicle speed time series
      const newSpeedArr = res.data.body.CAN.reduce((prev: ChartDataProps[], curr: CANProps) => {
        if (curr[PID_MAPPINGS.VEHICLE_SPEED] != null) prev.push({
          // The multiplication is necessary because curr.DEVICE_TS is a unix timestamp in seconds,
          // while the js Date() function expects a unix timestamp in milliseconds.
          x: parseInt(curr.DEVICE_TS)*1000,
          y: parseFloat(curr[PID_MAPPINGS.VEHICLE_SPEED]),
        });
        return prev;
      }, []);
      speedArr.current = newSpeedArr;
      setIsSpeedLoading(false);
    })
  };

  const getDeviceVoltage = (startDate: number, endDate?: number, sample?: boolean): void => {
    setIsVoltageLoading(true);
    const params = {
      device_id: id,
      start_date: startDate,
      end_date: endDate,
      ...(sample != false && { sample: 'True' })
    };
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.DEVICE_VOLTAGE, {
      params
    }).then(res => {
      // Processing voltage data to find latest voltage + plot voltage time series
      const newVoltageArr = res.data.body.reduce((prev: ChartDataProps[], curr: VoltageProps) => {
        const time = (new Date(curr.SERVER_DATETIME)).getTime();
        if (curr.VOLTAGE != null && !isNaN(time)) prev.push({
          x: time,
          y: parseFloat(curr.VOLTAGE),
        });
        return prev;
      }, []);
      voltageArr.current = newVoltageArr;
      setIsVoltageLoading(false);
    });
  };

  useEffect(() => {
    // The division is necessary because SERVER_DATETIME is saved as a unix timestamp in seconds in
    // the db, while the js Date() function expects a unix timestamp in milliseconds.
    getDeviceVoltage(subtractTime((new Date()).getTime(), defaultTimePeriod.value));
    getDeviceInfo(subtractTime((new Date()).getTime(), defaultTimePeriod.value));

    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.DEVICE_TRIPS, {
      params: {
        'device_id': id
      }
    }).then((res)=>{
      console.log(res)
      tripArr.current = Object.values(res.data.body);
      tripArr.current=tripArr.current.reverse()
      setIsTripDataLoading(false)
    });
  }, []);

  useEffect(() => {
    console.log("printing voltage array")
    console.log(voltageArr);
  }, [voltageArr]);

  useEffect(() => {
    console.log("printing speed array");
    console.log(speedArr);
  }, [speedArr]);

  return (
    <>
      <Header />
      <div className="device" style={{ display: 'grid', gap: '1rem' }}>
        <div style={{
          gridColumnStart: 1,
          gridColumnEnd: 3,
          gridRow: 1,
        }}>
          <div style={{
            display: 'grid',
            gap: '1rem',
            height: '100%'
          }}>
            <IdCard carPlate={carPlate.current} id={id || ''} />
            <VoltageCard 
              loading={isVoltageLoading}
              currentVoltage={voltageArr.current.length ? voltageArr.current[0].y : 99} />
          </div>
        </div>
        <div className='voltage-time-series-card'>
          <VoltageTimeSeriesCard data={voltageArr.current} loading={isVoltageLoading} updateData={getDeviceVoltage} />
        </div>
        <div className='vehicle-speed-time-series-card'>
          <VehicleSpeedTimeSeries data={speedArr.current} loading={isSpeedLoading} updateData={getDeviceSpeed} />
        </div>
        <div className='coordinates-and-trips-card'>
          <CoordinatesAndTripsCard id={id} position={position.current} tripData={tripArr.current} loading={isTripDataLoading} />
        </div>
        <div className='entities-card'>
          <EntitiesCard data={fullCanData.current} loading={isCanDataLoading} />
        </div>
      </div>
    </>
  );
}

export default Device;

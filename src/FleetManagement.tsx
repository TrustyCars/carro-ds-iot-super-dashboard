import './FleetManagement/dashboard.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from './constants';
import Header from './FleetManagement/header';
import { carIcon } from './FleetManagement/icons'


type PosProps = {
  device_id: string;
  lat: string;
  long: string;
  time: string;
};

const FleetManagement: React.FC = () => {
  const [PosKey, setPosKey] = useState(new Date);
  const [Pos, setPos] = useState<PosProps[]>([])
  //PosKey is use to aid in the rendering of the Pos state if its not added the page wont render properly
  let P: PosProps[];
  const navigate = useNavigate();

  const connecttoMQTT = () => {
    Amplify.configure({
      Auth: {
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
      }
    });
    Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: process.env.REACT_APP_REGION,
      aws_pubsub_endpoint: `wss://${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com/`,
    }));
  };

  const subscribeToDevice = async (id:string) => {
    Amplify.PubSub.subscribe(`$aws/things/${id}/gps`).subscribe({
      next: async (data: { value: { lat: string; long: string; timestamp: number } }) => {
        console.log("Message Recevied:",data)
        const updatePost=P
        updatePost.map(x=>{
          if(x.device_id==id){
            x.lat=data.value.lat
            x.long=data.value.long
            const date= new Date(data.value.timestamp*1000).toLocaleString('en-SG')
            x.time=date
          }
        })
        setPos(updatePost)
        setPosKey(new Date());
      },
      error: (error: any) => console.error(error),
      close: () => console.log('Done'),
    });
  };

  const getLatestPosition = () => {
    axios.get(ENDPOINT_HOME.PRODUCTION + ENDPOINT_PATHS.LATEST_POSITIONS).then((res)=>{
      const results =[]      
      for(let x=0; x< res.data.body.length;x++){
        if(res.data.body[x].DEVICE_ID!=null){
          const  i=Object()
          i["device_id"]=res.data.body[x].DEVICE_ID
          i["lat"]=res.data.body[x].GPS_LAT
          i["long"]=res.data.body[x].GPS_LONG
          // i["lat_ind"]=res.data.body[x].GPS_LAT_IND
          // i["long_ind"]=res.data.body[x].GPS_LONG_IND
          i["time"]=res.data.body[x].SERVER_DATETIME
          subscribeToDevice(res.data.body[x].DEVICE_ID)
          results.push(i)
        }
      }
      setPos(results)
      setPosKey(new Date());

      P=results 
    })
  }

  React.useEffect(()=>{
    connecttoMQTT()
    getLatestPosition()
  },[]);

  const renderPosition = () => {
    return Pos.map((x,idx) => (
      <Marker key={idx} position={[parseFloat(x.lat),parseFloat(x.long)]} icon={carIcon}>
        <Popup>
          <div
            className='marker-p'
            style={{
              marginBottom: '0.5rem',
            }}>{x.device_id}</div>
          <div style={{
            marginTop: '0',
          }}>{x.time}</div>
          <p 
            style={{
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={()=>navigate(`device/${x.device_id}${window.location.search}`)}
          >
            More details
          </p>
        </Popup>
      </Marker>
    ));
  };

  useEffect(()=>{
    connecttoMQTT();
    getLatestPosition();
  }, []);

  return (
    <>
      <Header />
      <div id='map'className="map">
      <MapContainer 
        center={{ lat: 1.3521, lng: 103.8198 }}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />   
        {renderPosition()}
        </MapContainer>
    </div>
    </>
  );
}

export default FleetManagement;

import React from 'react';
import { Accordion, AccordionSummary, Typography, CardContent, Card } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { CircularProgress} from '@mui/material';
import { DataGrid, GridColDef, GridRowId, GridSelectionModel } from '@mui/x-data-grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { COUNTRY_RADIUS } from '../constants';
import Trip from './trip'
import { carIcon, redIcon, greenIcon } from './icons'

const CURRENT_COUNTRY = "SINGAPORE";

type TripDataProps = {
  GPS_LAT: string;
  GPS_LONG: string;
  SERVER_DATETIME:string;
  DEVICE_ID:string;
}

type CoordinatesAndTripsCardProps = {
  id?: string;
  position?: {
    lat: number;
    long: number;
    time: Date;
  };
  tripData: TripDataProps[][];
  loading: boolean;
};

const CoordinatesAndTripsCard:React.FC<CoordinatesAndTripsCardProps> = ({ id, position, tripData, loading }) => {
  const [rows, setRows] = React.useState<{ id: number; startTime: string; endTime: string; }[]>([]);
  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [selectedTrips, setSelectedTrips] = React.useState<(TripDataProps & { ID: GridRowId })[][]>([])
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([0]);

  const onSelectTrip = (e: GridSelectionModel) => {
    const trips: (TripDataProps & { ID: GridRowId })[][]=[];
    for (let i=0;i<e.length;i++){
      const newTripArray = tripData[e[i] as number].reduce((previous: (TripDataProps & { ID: GridRowId })[], current: TripDataProps) => {
        const obj = {
            ...current,
            ID: e[i] as number,
        };
        const lat = parseFloat(obj.GPS_LAT);
        const long = parseFloat(obj.GPS_LONG);

        if (lat > COUNTRY_RADIUS[CURRENT_COUNTRY].LAT.MIN && lat < COUNTRY_RADIUS[CURRENT_COUNTRY].LAT.MAX
          && long > COUNTRY_RADIUS[CURRENT_COUNTRY].LONG.MIN && long < COUNTRY_RADIUS[CURRENT_COUNTRY].LONG.MAX) {
            //filter out coordinates that dont fall into the country radius
            previous.push(obj)
        }
        return previous;
        }, []);
      trips.push(newTripArray);
    }
    console.log(trips)

    setSelectedTrips(trips);
    setSelectionModel(e);
  }

  const initTrip = () => {
    const coordinates: (TripDataProps & { ID: GridRowId })[]=[]
    if (tripData.length!=0) {
      tripData[0].map(x => {
        const lat = parseFloat(x.GPS_LAT);
        const long = parseFloat(x.GPS_LONG);
        const obj = {
          ...x,
          ID: 0,
        };
        if (lat > COUNTRY_RADIUS[CURRENT_COUNTRY].LAT.MIN && lat < COUNTRY_RADIUS[CURRENT_COUNTRY].LAT.MAX
          && long > COUNTRY_RADIUS[CURRENT_COUNTRY].LONG.MIN && long < COUNTRY_RADIUS[CURRENT_COUNTRY].LONG.MAX) {
            // filter out coordinates that dont fall into the country radius
            coordinates.push(obj);
        }
      })
      setSelectedTrips([coordinates])
      setSelectionModel([0])
    }
  }

  React.useEffect(()=>{
    const rowObj=(
      id: number,
      startTime: string,
      endTime: string
    ) => {
      return { id, startTime, endTime };
    }
      setRows(tripData.map((x, idx) =>
      rowObj(idx, x[0]["SERVER_DATETIME"], x[x.length-1]["SERVER_DATETIME"])
    ));   
     setColumns([
      { field: 'id', headerName: 'ID',width: 100 },
      { field: 'startTime', headerName: 'Start Time', width: 200 },
      { field: 'endTime', headerName: 'End Time', width: 200 },
    ]);
    initTrip();
  }, [tripData])

  if (loading) {
    return (
      <Card variant="outlined" sx={{ width: '100%', height: '100%' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent><CircularProgress /></CardContent>
      </Card>
    );
  }
  else {
    return (
      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection:'column'
          }}>
            <Typography variant='h6' sx={{ mb: 1.5 }} color="text.secondary" align='left'>
              Latest Coordinates and Trips
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                Select Trips     ( {selectionModel.length} rows selected )      
                </AccordionSummary>
              <DataGrid autoHeight rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[10]} checkboxSelection disableSelectionOnClick selectionModel={selectionModel} onSelectionModelChange={e => onSelectTrip(e)} />
            </Accordion>
          </div>
          <MapContainer
            center={{ lat: 1.3521, lng: 103.8198 }}
            zoom={12}
            scrollWheelZoom={true}
            style={{marginTop:"1rem"}}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position
              &&  <Marker position={[position.lat, position.long]} icon={carIcon}>
                    <Popup>
                      <p className='marker-p'>{id}</p>
                      <p>{position.time.toLocaleString()}</p>
                    </Popup>
                  </Marker>}
                {selectedTrips.map((x, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Marker position={[parseFloat(x[0].GPS_LAT),parseFloat(x[0].GPS_LONG)]} icon={greenIcon}>
                        <Popup>
                          <p className='marker-p'>TRIP ID : {x[0].ID}</p>
                          <p>{x[0].SERVER_DATETIME.toLocaleString()}</p>
                        </Popup>
                      </Marker>
                      <Marker position={[parseFloat(x[x.length-1].GPS_LAT),parseFloat(x[x.length-1].GPS_LONG)]} icon={redIcon}>
                        <Popup>
                          <p className='marker-p'>TRIP ID: {x[x.length-1].ID}</p>
                          <p>{x[x.length-1].SERVER_DATETIME.toLocaleString()}</p>
                        </Popup>
                      </Marker>
                      <Trip trip={x}/>
                    </React.Fragment>
                  );
                })}
          </MapContainer>
        </CardContent>
      </Card> 
    );
  }
};

export default CoordinatesAndTripsCard;

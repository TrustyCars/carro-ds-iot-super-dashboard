import React from 'react';
import axios from 'axios';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import useWindowDimensions from '../hooks/useWindowDimensions';

const decryptCommand = (command: number) => {
  switch (command) {
    case 0:
      return 'Unlock';
    case 1:
      return 'Lock';
    default:
      return 'Unknown';
  }
};

const LockUnlockHistory: React.FC = () => {
  const { width } = useWindowDimensions();

  const [rows, setRows] = React.useState([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, },
    { field: 'date', headerName: 'Date', width: 200, },
    { field: 'device_id', headerName: 'Device ID', width: 150, },
    { field: 'command', headerName: 'Command', width: 150, },
  ];

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.STAGING + ENDPOINT_PATHS.COMMAND_HISTORY)
      .then(res => {
        setRows(res.data.body.map((r: any, i: number) => ({
          id: i,
          date: r.SERVER_DATETIME,
          device_id: r.DEVICE_ID,
          command: decryptCommand(r.COMMAND),
        })));
      });
  }, []);

  return (
    <div
      style={{
        width: (width > 1200 ? '45vw' : '90vw'),
        height: '85vh',
        paddingTop: '2rem',
        paddingLeft: '2rem',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
};

export default LockUnlockHistory;

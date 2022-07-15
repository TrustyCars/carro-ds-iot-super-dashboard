import React from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
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
        paddingTop: '2rem',
        paddingLeft: '2rem',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '1rem',
          height: '84vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '0.7rem',
            textAlign: 'center',
          }}
        >Device Command History</div>
        <div
          style={{ flexGrow: 1 }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize
            components={{ Toolbar: GridToolbar }}
            sx={{
              '& .MuiDataGrid-toolbarContainer': {
                display: 'flex',
                justifyContent: 'center',
                '& div': { flex: 0 },
              },
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default LockUnlockHistory;

import React from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { isDesktop } from '../utils/utils';

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

type LockUnlockHistoryProps = {
  visible: boolean;
};

const LockUnlockHistory: React.FC<LockUnlockHistoryProps> = ({
  visible,
}) => {
  const { width } = useWindowDimensions();

  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

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
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: (visible ? 'block' : 'none'),
        width: (isDesktop(width) ? '60vw' : '87vw'),
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
            loading={isLoading}
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

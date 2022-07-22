import React from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import useWindowDimensions from './hooks/useWindowDimensions';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from './constants';
import { isDesktop } from './utils/utils';

type ResActionProps = {
  TIMESTAMP: number;
  ACTION: string;
  METHOD_ACTIVATED: string;
  USER_ID: string;
};

type ActionProps = {
  id: number;
  date: string;
  action: string;
  method: string;
  user: string;
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', hide: true, },
  { field: 'date', headerName: 'Date', width: 200, },
  { field: 'action', headerName: 'Action', width: 150, },
  { field: 'method', headerName: 'Method', width: 180, },
  { field: 'user', headerName: 'User ID', width: 150, },
];

const SalesPod: React.FC = () => {
  const { width } = useWindowDimensions();

  const [actions, setActions] = React.useState<ActionProps[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.SALES_POD_STAGING + ENDPOINT_PATHS.GET_ACTIONS)
      .then(res => {
        console.log(res);
        setActions(res.data.body.map((a: ResActionProps, i: number) => ({
          id: i,
          date: (new Date(a.TIMESTAMP * 1000)).toLocaleString(),
          action: a.ACTION,
          method: a.METHOD_ACTIVATED,
          user: a.USER_ID,
        })));
        setIsLoading(false);
      });
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        margin: '2%',
      }}
    >
      <div
        style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '0.7rem',
          textAlign: 'center',
        }}
      >Sales Pod Actions</div>
      <div
        style={{
          width: (isDesktop(width) ? '60vw' : '90vw'),
          flexGrow: 1,
        }}
      >
        <DataGrid
          rows={actions}
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
  );
};

export default SalesPod;

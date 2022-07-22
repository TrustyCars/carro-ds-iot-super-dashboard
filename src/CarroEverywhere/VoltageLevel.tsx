import React from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow } from '@mui/material';
import { ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { isDesktop } from '../utils/utils';

type VoltageLevelProps = {
  visible: boolean;
};

const VoltageLevel: React.FC<VoltageLevelProps> = ({
  visible,
}) => {
  const { width } = useWindowDimensions();

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.STAGING + ENDPOINT_PATHS.LATEST_VOLTAGE_LEVELS)
      .then(res => {
        setRows(res.data.body);
      });
  }, []);

  return (
    <div
      style={{
        display: (visible ? 'block' : 'none'),
        width: (isDesktop(width) ? '60vw' : '87vw'),
      }}
    >
      <Paper elevation={3} sx={{ padding: '1rem', paddingTop: '0.3rem' }}>
        <TableContainer component='div' sx={{ 'th, td': { fontFamily: 'Poppins' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3} sx={{ fontSize: '1.2rem', fontWeight: '600', paddingBottom: '0.75rem' }}>
                  Devices with Low Battery Level
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Device ID</TableCell>
                <TableCell align="right">Carplate Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: { [key: string]: any}) => (
                <TableRow
                  key={`${row.TIMESTAMP}_${row.DEVICE_ID}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {new Date(parseInt(row.TIMESTAMP)*1000).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{row.DEVICE_ID}</TableCell>
                  <TableCell align="right">{row.CARPLATE_NO}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default VoltageLevel;

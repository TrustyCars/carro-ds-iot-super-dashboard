import React from 'react';
import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ChartDataProps } from './device';
import TimeSeriesChart from './timeSeriesChart';

import { COLORS } from '../constants';
import TimePeriodSelect, { DropdownOptionProps, timePeriodOptions } from './timePeriodSelect';

type VoltageTimeSeriesCardProps = {
  data: ChartDataProps[];
  loading: boolean;
  updateData: (startDate: number, endDate?: number, sample?: boolean) => void;
};

export const subtractTime = (from: number, timePeriodVal: string): number => {
  const dateMin = new Date(from);
  switch (timePeriodVal) {
    case '2h':
      dateMin.setHours(dateMin.getHours() - 2);
      break;
    case '1d':
      dateMin.setDate(dateMin.getDate() - 1);
      break;
    case '2d':
      dateMin.setDate(dateMin.getDate() - 2);
      break;
    case '1w':
      dateMin.setDate(dateMin.getDate() - 7);
      break;
    default:
      return 0;
  }

  return Math.floor(dateMin.getTime()/1000);
};

const VoltageTimeSeriesCard: React.FC<VoltageTimeSeriesCardProps> = ({ data,loading, updateData }) => {
  const [timePeriodOption, setTimePeriodOption] = React.useState<DropdownOptionProps>(timePeriodOptions[3]);
  const [formattedData, setFormattedData] = React.useState(data);

  const originalData = React.useRef<ChartDataProps[]>();

  const [isSampleOn, setIsSampleOn] = React.useState(true);

  React.useEffect(() => {
    if (originalData.current === undefined || originalData.current?.length === 0) {
      originalData.current = data;
    }

    setFormattedData(data);
  }, [JSON.stringify(data)]);

  if (loading) {
    return (
      <Card
        className='voltage-time-series-loading-card'
        variant="outlined"
        sx={{ width: '100%', height: '100%', minHeight: '38rem' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CardContent><CircularProgress /></CardContent>
      </Card>
    );
  }
  else {
    return (
      <Card variant="outlined" sx={{ width: '100%', maxWidth: '95vw', height: '100%', position: 'relative' }}>
        <CardContent>
          <div style={{
            display: 'flex'
          }}>
            <Typography variant='h6' sx={{ mb: 0, mr: 3 }} color="text.secondary" align='left'>
              Voltage vs Time
            </Typography>
            <TimePeriodSelect value={timePeriodOption} onChange={(timePeriodOption: DropdownOptionProps) => {
                setTimePeriodOption(timePeriodOption);
                updateData(subtractTime((new Date()).getTime(), timePeriodOption.value), undefined, isSampleOn);
                originalData.current = [];
              }}
            />
          </div>
          <TimeSeriesChart
            type='line'
            color={COLORS.PRIMARY}
            data={formattedData}
            isSampleOn={isSampleOn}
            setIsSampleOn={setIsSampleOn}
            resetOriginalData={() => {
              originalData.current = [];
            }}
            labels={({ datum }) => {
              const date = new Date(datum.x);
              return `Voltage: ${datum.y}\nDate: ${date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()}`;
            }}
            originalData={originalData.current}
            xAxisLabel='Time'
            yAxisLabel='Voltage'
            hintPosition={{
              right: '2rem',
            }}
            updateData={updateData}
          />
        </CardContent>
      </Card> 
    );
  }
};

export default VoltageTimeSeriesCard;

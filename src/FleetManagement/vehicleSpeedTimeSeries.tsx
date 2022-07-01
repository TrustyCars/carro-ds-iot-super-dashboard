import React from 'react';
import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TimeSeriesChart from './timeSeriesChart';
import { ChartDataProps } from './device';
import { COLORS } from '../constants';
import TimePeriodSelect, { defaultTimePeriod, DropdownOptionProps } from './timePeriodSelect';
import { subtractTime } from './voltageTimeSeries';

type VehicleSpeedTimeSeriesProps = {
  data: ChartDataProps[];
  loading: boolean;
  updateData: (startDate: number, endDate?: number, sample?: boolean) => void;
};

export const getFilteredData = (data : ChartDataProps[], timePeriodOptionValue: string) => {
  const dateMin = new Date();
    switch (timePeriodOptionValue) {
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
      case 'all':
        return data;
    }
  return data.filter(d => {
    return (d.x > dateMin.getTime());
  });
};

const VehicleSpeedTimeSeries: React.FC<VehicleSpeedTimeSeriesProps> = ({ data, loading, updateData }) => {
  const [timePeriodOption, setTimePeriodOption] = React.useState<DropdownOptionProps>(defaultTimePeriod);
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
      <Card variant="outlined" sx={{ width: '100%', height: '100%', minHeight: '38rem' }}
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
      <Card variant="outlined" sx={{ width: '100%', maxWidth: '95vw', height: '100%', position: 'relative' }}>
        <CardContent>
          <div style={{
            display: 'flex'
          }}>
            <Typography variant='h6' sx={{ mb: 0, mr: 3 }} color="text.secondary" align='left'>
              Vehicle Speed vs Time
            </Typography>
            <TimePeriodSelect
              value={timePeriodOption}
              onChange={(timePeriodOption: DropdownOptionProps) => {
                setTimePeriodOption(timePeriodOption);
                updateData(subtractTime((new Date()).getTime(), timePeriodOption.value), undefined, isSampleOn);
              }}
            />
          </div>
          <TimeSeriesChart
            type='areabar'
            color={COLORS.PRIMARY}
            data={formattedData}
            labels={({ datum }) => {
              const date = new Date(datum.x);
              return `Speed: ${datum.y}\nDate: ${date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()}`;
            }}
            isSampleOn={isSampleOn}
            setIsSampleOn={setIsSampleOn}
            resetOriginalData={() => {
              originalData.current = [];
            }}
            originalData={originalData.current}
            updateData={updateData}
            xAxisLabel='Time'
            yAxisLabel='Speed'
          /> 
        </CardContent>
      </Card> 
    );
  }
};

export default VehicleSpeedTimeSeries;

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Select from 'react-select'
import { PID_MAPPINGS } from '../constants';
import TimeSeriesChart from './timeSeriesChart';
import { ChartDataProps } from './device';
import { getFilteredData } from './vehicleSpeedTimeSeries';
import TimePeriodSelect, { DropdownOptionProps, timePeriodOptions } from './timePeriodSelect';

type EntitiesProps = {
  data: {
    [key: string]: string;
  }[];
  loading: boolean;
};

const dropdownOptions = Object.keys(PID_MAPPINGS).map(k => ({
  value: PID_MAPPINGS[k],
  label: k,
}));

const EntitiesCard: React.FC<EntitiesProps> = ({ data, loading }) => {
  const [pidOption, setPidOption] = React.useState<{ label: string; value: string }[]>([dropdownOptions[0]]);
  const [viewOption, setViewOption] = React.useState<string>('table');

  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [rows, setRows] = React.useState<{ [key: string]: string | number }[]>([]);

  const [chartData, setChartData] = React.useState<ChartDataProps[][]>([]);
  const [chartKey, setChartKey] = React.useState(new Date());

  const maxYTickChars = React.useRef<number>(1);

  const [timePeriodOption, setTimePeriodOption] = React.useState<DropdownOptionProps>(timePeriodOptions[3]);

  const chartColors = ['grey', 'black', 'lightgrey'];

  React.useEffect(() => {
    if (viewOption == 'table') {
      setColumns([
        { field: 'id', headerName: 'ID', hide: true },
        { field: 'time', headerName: 'Time', width: 200 },
      ].concat(pidOption.map(option => (
        { field: option.value, headerName: option.label, width: 300 }
      ))));

      setRows(data.reduce((prev: { [key: string]: string | number }[], curr) => {
        if (pidOption.filter(option => curr[option.value] != null).length) {
          const row: { [key: string]: string | number } = {
            id: prev.length,
            time: (new Date(parseInt(curr.DEVICE_TS)*1000)).toLocaleString(),
          };
          pidOption.map(option => {
            row[option.value] = curr[option.value];
          });
          prev.push(row);
        }
        return prev;
      // Need to reverse because the data is received in reverse chronological order
      }, []).reverse());
    }
    else if (viewOption == 'chart') {
      const newChartData: ChartDataProps[][] = [];
      pidOption.map(option => {
        const reducedData = data.reduce((prev: ChartDataProps[], curr) => {
          if (curr[option.value] != null) {
            prev.push({
              x: parseInt(curr.DEVICE_TS)*1000,
              y: parseFloat(curr[option.value]),
            });
            maxYTickChars.current = curr[option.value].length;
          }
          return prev;
        }, []);
        newChartData.push(getFilteredData(reducedData, timePeriodOption.value));
      });
      setChartData(newChartData);
      setChartKey(new Date());
    }
  }, [pidOption.length, viewOption, timePeriodOption]);

  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{ width: '100%', height: '14rem' }}
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
      <Card variant="outlined" sx={{ width: '100%', height: 'max-content', minHeight: '10rem' }}>
        <CardContent>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}>
              <Typography variant='h6' sx={{ mb: 1.5 }} color="text.secondary" textAlign='left'>
                Entities
              </Typography>
              <div style={{
                display: 'flex',
              }}>
                <div style={{ width: '30%' }}>
                  <Select
                    isMulti
                    options={dropdownOptions}
                    defaultValue={dropdownOptions[0]}
                    onChange={value => {
                      if (value) setPidOption(Array.from(value));
                    }}
                    styles={{
                      option: (provided) => ({
                        ...provided,
                        textAlign: 'left',
                        wordBreak: 'break-all',
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        textAlign: 'left',
                      }),
                      control: (provided) => ({
                        ...provided,
                        marginRight: '1.5rem',
                      }),
                    }}
                  />
                </div>
                {viewOption == 'chart' &&
                  <div style={{ width: '15%' }}>
                    <TimePeriodSelect
                      value={timePeriodOption}
                      onChange={(timePeriodOption: DropdownOptionProps) => {
                        setTimePeriodOption(timePeriodOption);
                      }}
                    />
                  </div>}
              </div>
            </div>
            <div style={{ width: 'max-content' }}>
              <RadioGroup
                defaultValue="table"
                name="radio-buttons-group"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setViewOption(event.target.value);
                }}
              >
                <FormControlLabel value="table" control={<Radio />} label="Table View" />
                <FormControlLabel value="chart" control={<Radio />} label="Chart View" />
              </RadioGroup>
            </div>
          </div>
          <div style={{ width: '90vw', minHeight: '10vh' }}>
            {viewOption == 'table'
              ? <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      autoHeight
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                    />
                  </div>
                </div>
              : <div style={{ width: '100%' }}>
                  {chartData.map((d, i) => (
                    <div style={{ marginBottom: '4rem' }}>
                      <TimeSeriesChart
                        key={i}
                        canSample={false}
                        data={d}
                        color={chartColors[i%chartColors.length]}
                        height={300}
                        labels={({ datum }) => {
                          const date = new Date(datum.x);
                          return `Voltage: ${datum.y}\nDate: ${date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()}`;
                        }}
                        margin={{ top: 50 }}
                        xAxisLabel='Time'
                        yAxisLabel={pidOption[i] && pidOption[i].label}
                      />
                    </div>
                  ))}
                </div>
            }
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default EntitiesCard;

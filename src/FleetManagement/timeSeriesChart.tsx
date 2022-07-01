import React from 'react';
import {
  AreaSeries,
  VerticalBarSeries,
  FlexibleXYPlot,
  LineSeries,
  LineSeriesPoint,
  MarkSeries,
  MarkSeriesPoint,
  XAxis,
  YAxis, 
  Highlight,
  HighlightArea} from 'react-vis';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { COLORS } from '../constants';
import { ChartDataProps } from './device';
import { Styled } from './deviceInfoCardStyles';
import { Button, Checkbox, FormControlLabel } from '@mui/material';

type TimeSeriesChartProps = {
  canSample?: boolean; // indicates if the data can be un-sampled. Default true.
  color: string;
  data: LineSeriesPoint[];
  height?: number;
  hintPosition?: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  isSampleOn?: boolean;
  setIsSampleOn?: React.Dispatch<React.SetStateAction<boolean>>;
  resetOriginalData?: () => void;
  labels: ({ datum }: { datum: { x: Date | number; y: number} }) => string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  margin?: {
    right?: number;
    top?: number;
    left?: number;
    bottom?: number;
  };
  originalData?: ChartDataProps[]; // The data to display after 'Reset zoom' is clicked on a zoomable chart
  type?: 'line' | 'mark' | 'linemark' | 'areabar';
  updateData?: (startDate: number, endDate?: number, sample?: boolean) => void;
  zoomable?: boolean;
};

export type NearestXProps = {
  hoverValue?: LineSeriesPoint | MarkSeriesPoint;
  index?: number
}

const numberOrZero = (num: number | undefined) : number => {
  return (num || 0);
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  canSample = true,
  color,
  data,
  height = 500,
  hintPosition,
  isSampleOn,
  setIsSampleOn,
  resetOriginalData,
  margin,
  originalData,
  labels,
  type = 'line',
  updateData,
  xAxisLabel,
  yAxisLabel,
  zoomable = true,
}) => {
  const fontMultiplier = window.innerHeight / 1500;
  const [nearestX, setNearestX] = React.useState<NearestXProps>();

  const [barData, setBarData] = React.useState<ChartDataProps[]>([]);

  const [lastDrawLocation, setLastDrawLocation] = React.useState<HighlightArea>();
  const [isBrushing, setIsBrushing] = React.useState<boolean>(false);

  const [currData, setCurrData] = React.useState<ChartDataProps[]>(data);

  // const isZoomed = React.useRef<boolean>(false);

  const updateBarData = () => {
    if (currData.length) {
      const newBarData: ChartDataProps[] = [];
      const interval = Math.max(Math.floor(currData.length/20), 1);
      for (let i=0; i<currData.length; i+=interval) {
        let currTotal = 0;
        for (let j=0; j<interval; j++) {
          if (currData[i+j]) {
            currTotal += currData[i+j].y;
          }
        }
        newBarData.push({
          x: currData[i].x,
          y: currTotal/interval,
        });
      }
      setBarData(newBarData);
    }
    else setBarData([]);
  };

  React.useEffect(() => {
    setCurrData(data);

    // if (JSON.stringify(originalData) !== JSON.stringify(data)) {
    //   isZoomed.current = true;
    // }
  }, [JSON.stringify(data)]);

  React.useEffect(() => {
    if (type == 'areabar') updateBarData();
  }, [currData]);

  if (data.length == 0) {
    return (
      <Card sx={{
        minHeight: '20vh',
        background: '#ffdebd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem',
        marginRight: '2rem',
      }}>
        <CardContent>
          <Typography variant='h6' color="text.secondary" align='center'>
            Sorry, there seems to be no data {yAxisLabel && `for ${yAxisLabel} `}here...
          </Typography>
        </CardContent>
      </Card>
    );
  }
  else {
    return (
      <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          cursor: 'crosshair',
        }}  
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {zoomable
            && <Button
                variant='outlined'
                // disabled={!isZoomed.current}
                sx={{
                  width: 'max-content',
                  marginRight: '1rem',
                }}
                onClick={() => {
                  setLastDrawLocation(undefined);
                  if (originalData) setCurrData(originalData);
                  // isZoomed.current = false;
                }}
              >Reset Zoom</Button>}
          {canSample
            && <FormControlLabel
                control={
                  <Checkbox
                    checked={isSampleOn}
                    onChange={event => {
                      updateData && updateData(data[data.length-1].x/1000, undefined, event.target.checked);
                      resetOriginalData && resetOriginalData();
                      setIsSampleOn && setIsSampleOn(event.target.checked);
                    }} />
                }
                label="Sample data" />}
        </div>
        <FlexibleXYPlot
          xDomain={
            lastDrawLocation && [
              lastDrawLocation.left,
              lastDrawLocation.right
            ]
          }
          height={height}
          margin={{
            right: margin?.right || 30,
            top: margin?.top || 30,
            left: margin?.left || 50,
            botttom: margin?.bottom || 0,
          }}
        >
          {(type == 'line' || type == 'linemark') &&
            <LineSeries
              style={{ fill: 'none', stroke: color, strokeWidth: 2, pointerEvents: (isBrushing ? 'none' : 'auto') }}
              color={color}
              data={currData}
              onNearestX={(value, { index }) => setNearestX({ hoverValue: value, index })}
              onSeriesMouseOut={() => setNearestX({ })}
            />}
          {(type == 'mark' || type =='linemark') &&
            <MarkSeries
              style={{ fill: COLORS.PRIMARY }}
              color={color}
              data={currData}
              sizeRange={[1]}
              // onNearestX={(value, { index }) => setNearestX({ hoverValue: value, index })}
              // onSeriesMouseOut={() => setNearestX({ })}
            />}
          {type == 'areabar' &&
            <AreaSeries
              style={{ fill: COLORS.PRIMARY, opacity: 0.5 }}
              color={color}
              data={currData}
              onNearestX={(value, { index }) => setNearestX({ hoverValue: value, index })}
              onSeriesMouseOut={() => setNearestX({ })}
            />}
          {type == 'areabar' &&
            <VerticalBarSeries data={barData} barWidth={0.8} fill='rgba(33, 168, 236, 0.7)' />}
          <XAxis
            title={xAxisLabel || ''}
            tickTotal={3}
            tickPadding={10}
            tickFormat={(value) => {
              const date = new Date(value);

              return date.toLocaleTimeString();
            }}
          />
          <YAxis
            title={yAxisLabel || ''}
            tickPadding={0}  
          />
          {nearestX && nearestX.hoverValue &&
            <MarkSeries
              sizeRange={[50, 50]}
              color={COLORS.PRIMARY}
              data={[nearestX.hoverValue]}
              style={{ pointerEvents: (isBrushing ? 'none' : 'auto') }} />}
          {zoomable
          && <Highlight
              enableY={false}
              onBrushStart={() => {
                setIsBrushing(true);
                // isZoomed.current = true;
              }}
              onBrushEnd={area => {
                if (area) {
                  setLastDrawLocation({ ...lastDrawLocation, ...area });
                  updateData && updateData(Math.floor(numberOrZero(area.left)/1000), Math.floor(numberOrZero(area.right)/1000), isSampleOn);
                }
                setIsBrushing(false);
              }}
            />}
          {nearestX && nearestX.hoverValue && (
            <Styled.TimeSeriesHint
              align={{vertical: 'top', horizontal: 'right'}}
              value={nearestX.hoverValue}
              labels={labels}
              hintPosition={{
                left: `${hintPosition && hintPosition.left ? hintPosition.left: 'auto'} !important`,
                bottom: `${hintPosition && hintPosition.bottom ? hintPosition.bottom: 'auto'} !important`,
                right: (hintPosition && hintPosition.right ? hintPosition.right : '0rem'),
                top: (hintPosition && hintPosition.top ? hintPosition.top : '-2rem'),
              }}
              className='time-series-chart-hint'
            >
              <div style={{
                background: 'white',
                boxShadow: '0px 1px 2px rgb(0 0 0 / 25%)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '12rem',
                justifyContent: 'flex-start',
                padding: '0.5rem',
                fontSize: `${1.6*fontMultiplier}rem`
              }}>
                <div style={{ margin: '0.2rem 0', textAlign: 'left' }}>{yAxisLabel}: {nearestX.hoverValue.y.toString()}</div>
                <div style={{ margin: '0.2rem 0', textAlign: 'left' }}>Date: {(new Date(nearestX.hoverValue.x)).toLocaleString()}</div>
              </div>
            </Styled.TimeSeriesHint>
          )}
        </FlexibleXYPlot>
      </div>
    );
  }
};

export default TimeSeriesChart;

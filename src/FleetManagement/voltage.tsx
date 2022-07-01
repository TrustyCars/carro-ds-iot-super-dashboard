import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './deviceInfoCardStyles.css';
import { CircularProgress } from '@mui/material';

type VoltageCardProps = {
  currentVoltage: number;
  maxVoltage?: number;
  loading: boolean;
};

const VoltageCard : React.FC<VoltageCardProps> = ({
  currentVoltage,
  maxVoltage = 16,
  loading
} : VoltageCardProps) => {
  return (
    <Card className='voltage-card' variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        {loading
          ? <CircularProgress color='primary' />
          : <>
              <Typography variant='h6' color="text.secondary" align='left'>
                Voltage
              </Typography>
              <div className='voltage-indicator' style={{
                background: `linear-gradient(90deg, #72e062 0%, #72e062 ${currentVoltage/maxVoltage*100}%, #1f1f1f ${currentVoltage/maxVoltage*100}%, #1f1f1f 100%)`,
              }}>
                <Typography variant="h6" align='left'>
                  {currentVoltage}
                </Typography>
              </div>
            </>
        }
      </CardContent>
    </Card> 
  );
};

export default VoltageCard;

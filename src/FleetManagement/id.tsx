import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const IdCard = ({ carPlate, id } : { carPlate: string; id: string }) => {
  return (
    <Card className='id-card' variant="outlined" sx={{ width: '100%', gridColumn: 1 }}>
      <CardContent>
        <Typography variant='h6' color="text.secondary" align='left'>
          Device
        </Typography>
        <Typography variant="h5" align='left'>
          {id}
        </Typography>
        {carPlate &&
          <>
            <Typography variant='h6' color="text.secondary" align='left' sx={{ mt: '0.5rem' }}>
              Car Plate
            </Typography>
            <Typography variant="h5" align='left'>
              {carPlate.toString()}
            </Typography>
          </>}
      </CardContent>
    </Card>
  );
};

export default IdCard;

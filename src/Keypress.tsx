import React from 'react';
import { Button } from '@mui/material';

const getButtonColor = (currentKeypressStatus: string) => {
  if (currentKeypressStatus == 'locked') return '#8BBD56';
  else return '#DD4F40';
};

const Keypress: React.FC = () => {
  const [keypressStatus, setKeypressStatus] = React.useState('locked');

  return (
    <div
      style={{
        width: '100vw',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 'fit-content',
          padding: '1.5rem 2rem',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          Your Keypress is currently <span style={{ fontWeight: 600 }}>{keypressStatus}</span>.
        </div>
        <Button
          variant='contained'
          sx={{
            width: '100%',
            minHeight: '2.8rem',
            textTransform: 'none',
            backgroundColor: getButtonColor(keypressStatus),
            ":hover": { backgroundColor: getButtonColor(keypressStatus) },
            ":focus": { backgroundColor: getButtonColor(keypressStatus) },
          }}
        >
          {keypressStatus == 'locked' ? 'Unlock' : 'Lock'}
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true });
            navigator.bluetooth.addEventListener('advertisementreceived', ev => {
              console.log(ev);
            });
          }}>temp: Scan for devices</Button>
      </div>
    </div>
  );
};

export default Keypress;

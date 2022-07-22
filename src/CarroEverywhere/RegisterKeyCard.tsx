import React from 'react';
import { FormLabel, Paper, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface RegisterKeyCardProps extends React.ComponentPropsWithoutRef<'div'> {
  // if true, an 'x' icon will be displayed on the top right of the card. when clicked
  // the onClear function, if provided, will be called.
  isClearable?: boolean;
  onClear?: () => void;

  children?: React.ReactNode;
}

const RegisterKeyCard = React.forwardRef<{}, RegisterKeyCardProps>(({
  isClearable = false,
  onClear,
}, ref) => {
  const [keyTypeValue, setKeyTypeValue] = React.useState('main');
  const [keyLocationValue, setKeyLocationValue] = React.useState('device');

  const [keypressNumber, setKeypressNumber] = React.useState<string>('');
  const [serialNumber, setSerialNumber] = React.useState<string>('');

  React.useImperativeHandle(ref, () => ({
    getData: () => {
      return {
        type: keyTypeValue,
        location: keyLocationValue,
        ...(keyLocationValue === 'keypress' ? { keypress_number: parseInt(keypressNumber) } : {}),
        ...(keyLocationValue === 'keypress' ? { serial_number: serialNumber } : {}),
      };
    },
    reset: () => {
      setKeyTypeValue('main');
      setKeyLocationValue('device');
      setKeypressNumber('');
      setSerialNumber('');
    },
  }));

  return (
    <Paper
      elevation={1}
      sx={{
        padding: '2rem',
        marginTop: '0.7rem',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        position: 'relative',
      }}
    >          
      {isClearable &&
        <CloseRoundedIcon
          sx={{ position: 'absolute', right: '1rem', top: '1rem', cursor: 'pointer', zIndex: 10 }}
          onClick={() => onClear && onClear()}
        />
      }
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: '2rem',
          marginBottom: '2rem',
        }}
      >
        <FormLabel sx={{ marginBottom: '0.5rem' }}>Type</FormLabel>
        <ToggleButtonGroup
          value={keyTypeValue}
          exclusive
          onChange={(_event, newValue) => { if (newValue !== null) setKeyTypeValue(newValue) }}
        >
          <ToggleButton value='main' sx={{ padding: '0.75rem 1.25rem' }}>
            Main
          </ToggleButton>
          <ToggleButton value='spare' sx={{ padding: '0.75rem 1.25rem' }}>
            Spare
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FormLabel sx={{ marginBottom: '0.5rem' }}>Location</FormLabel>
        <ToggleButtonGroup
          value={keyLocationValue}
          exclusive
          onChange={(_event, newValue) => { if (newValue !== null) setKeyLocationValue(newValue) }}
        >
          <ToggleButton value="device" sx={{ padding: '0.75rem 1.25rem' }}>
            Device
          </ToggleButton>
          <ToggleButton value="keypress" sx={{ padding: '0.75rem 1.25rem' }}>
            Keypress
          </ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label='Keypress number'
          variant='filled'
          disabled={keyLocationValue === 'device'}
          sx={{ marginTop: '0.5rem' }}
          required={keyLocationValue === 'keypress'}
          value={keypressNumber}
          onChange={event => setKeypressNumber(event.target.value)}
        />
        <TextField
          label='Serial number'
          variant='filled'
          disabled={keyLocationValue === 'device'}
          sx={{ marginTop: '0.5rem', }}
          required={keyLocationValue === 'keypress'}
          value={serialNumber}
          onChange={event => setSerialNumber(event.target.value)}
        />
      </div>
    </Paper>
  );
});

export default RegisterKeyCard;

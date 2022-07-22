import React from 'react';
import { Alert, AlertColor, Snackbar as MuiSnackbar } from '@mui/material';

type SnackbarProps = {
  message: string;
  isSnackbarOpen: boolean;
  setIsSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  status: AlertColor;
};

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isSnackbarOpen,
  setIsSnackbarOpen,
  status,
}) => {
  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
  
    setIsSnackbarOpen(false);
  };

  return (
    <MuiSnackbar
      sx={{ mb: 2 }}
      open={isSnackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert onClose={handleCloseSnackbar} severity={status} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;

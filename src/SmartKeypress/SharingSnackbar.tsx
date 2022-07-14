import React from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

type SharingSnackbarProps = {
  errorMessage?: string;
  isSnackbarOpen: boolean;
  setIsSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  status: AlertColor;
};

const SharingSnackbar: React.FC<SharingSnackbarProps> = ({
  errorMessage,
  isSnackbarOpen,
  setIsSnackbarOpen,
  status,
}) => {
  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
  
    setIsSnackbarOpen(false);
  };

  return (
    <Snackbar
      sx={{ mb: 2 }}
      open={isSnackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert onClose={handleCloseSnackbar} severity={status} sx={{ width: '100%' }}>
        {status === 'success'
          ? 'Permissions update success!'
          : `Permissions update failed. ${errorMessage}`}
      </Alert>
    </Snackbar>
  );
};

export default SharingSnackbar;

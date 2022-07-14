import React from 'react';
import { Typography, Chip, Button } from '@mui/material';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { COLORS } from '../constants';
import { KeypressDeviceProps, UserProps } from '../Keypress';
import strftime from '../utils/strftime';
import SharingModal from './SharingModal';

type VehicleListItemProps = {
  device: KeypressDeviceProps;
  users: UserProps[];
};

const VehicleListItem: React.FC<VehicleListItemProps> = ({
  device,
  users,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <SharingModal
        device={device}
        users={users}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div>
        <Typography variant="h5" component="div">
          {device.CARPLATE_NO}
        </Typography>
        <Typography>
          Keypress: <span style={{ fontWeight: 'bold' }}>{device.KEYPRESS}</span>
        </Typography>
        <Chip
          color='default'
          label={device.PERMISSION}
          sx={{ textTransform: 'lowercase', fontSize: '0.8rem', marginTop: '0.5rem', height: '1.2rem' }}
        />
        {device.PERMISSION !== 'OWNER' &&
          <Chip
            color='default'
            label={`Expires on: ${strftime('%e/%n/%g', new Date((device.EXPIRY_DATE || 0)*1000))}`}
            sx={{ textTransform: 'lowercase', fontSize: '0.8rem', marginTop: '0.5rem', height: '1.2rem', marginLeft: '0.5rem' }}
          />
        }
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '1.4rem',
        }}
      >
        {device.PERMISSION !== 'DRIVER' &&
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            variant="contained"
            startIcon={
              <ShareRoundedIcon fontSize='large' />
            }
            sx={{
              padding: '0.5rem 0',
              flexGrow: 1,
              marginRight: '0.5rem',
              textTransform: 'none',
              backgroundColor: COLORS.LIGHTGREY,
              color: COLORS.BLACK,
              ":hover": { backgroundColor: COLORS.LIGHTGREY, },
            }}
          >
            Share
          </Button>
        }
        <Button
          variant="contained"
          startIcon={
            <LockOpenRoundedIcon fontSize='large' />
          }
          sx={{
            padding: '0.5rem 0',
            flexGrow: 1,
            backgroundColor: COLORS.LIGHTGREEN,
            color: COLORS.GREEN,
            boxShadow: '0px 3px 1px -2px rgb(139 190 85 / 30%), 0px 2px 2px 0px rgb(139 190 85 / 30%), 0px 1px 5px 0px rgb(139 190 85 / 50%)',
            textTransform: 'none',
            ":hover": { backgroundColor: COLORS.LIGHTGREY, },
          }}
        >
          Unlock
        </Button>
      </div>
    </div>
  );
};

export default VehicleListItem;

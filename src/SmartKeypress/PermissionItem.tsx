import React from 'react';
import { FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { PermissionsProps } from './SharingModal';
import { COLORS } from '../constants';

type PermissionItemProps = {
  clearable?: boolean;
  onChangeExpiryDate: (newDate: Date | null) => void;
  onChangePermissions: (event: SelectChangeEvent) => void;
  onClear?: (user_id: string) => void;
  permission: PermissionsProps;
  isCurrUser: boolean;
  isUserOwner: boolean;
  maxExpiryDate: number | null;
};

const PermissionItem: React.FC<PermissionItemProps> = ({
  clearable = false,
  onChangeExpiryDate,
  onChangePermissions,
  onClear,
  permission,
  isCurrUser,
  isUserOwner,
  maxExpiryDate,
}) => {
  const [expiryDate, setExpiryDate] = React.useState<Date | null>(
    permission.EXPIRY_DATE ? new Date(permission.EXPIRY_DATE * 1000) : null);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {clearable &&
        <HighlightOffRoundedIcon
          sx={{
            color: COLORS.GREY,
          }}
          onClick={() => onClear && onClear(permission.USER_ID)}
        />
      }
      <div
        style={{
          flexGrow: 1,
          marginLeft: (clearable ? '0.5rem' : '0'),
        }}
      >{permission.USER_ID}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <FormControl
          variant='standard'
          sx={{ marginBottom: '1.2rem' }}
        >
          <Select
            disabled={isCurrUser}
            value={permission.PERMISSION}
            onChange={onChangePermissions}
          >
            <MenuItem value='DRIVER'>Driver</MenuItem>
            <MenuItem value='MANAGER'>Manager</MenuItem>
            {isUserOwner &&
              <MenuItem value='OWNER'>Owner</MenuItem>
            }
          </Select>
        </FormControl>
        {permission.PERMISSION != 'OWNER' &&
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Expiry date*"
              value={expiryDate}
              disabled={isCurrUser}
              disablePast
              shouldDisableDate={(day: Date) => {
                if (maxExpiryDate == null) return false;
                else return (day.valueOf() / 1000 > maxExpiryDate);
              }}
              onChange={(newValue) => {
                setExpiryDate(newValue);
                onChangeExpiryDate(newValue);
              }}
              renderInput={(params) => 
                <TextField
                  {...params}
                  sx={{
                    'div': { fontSize: '0.85rem' },
                    'label': { fontSize: '0.85rem', lineHeight: '1rem' },
                    'input': {
                      height: '1rem',
                      padding: '0.8rem 0.6rem'
                    },
                  }}
                />}
            />
          </LocalizationProvider>
        }
      </div>
    </div>
  );
};

export default PermissionItem;

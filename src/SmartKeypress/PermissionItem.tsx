import React from 'react';
import { FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { PermissionsProps } from './SharingModal';
import { COLORS } from '../constants';

type PermissionItemProps = {
  compact?: boolean; // if true, will only display user_id
  clearable?: boolean; // if true, will display an 'x' icon to the left of the user_id
  disable?: boolean;
  onChangeExpiryDate?: (newDate: Date | null) => void;
  onChangePermissions?: (event: SelectChangeEvent) => void;
  onClear?: (permission: PermissionsProps) => void;
  permission: PermissionsProps;
  isCurrUser: boolean;
  isUserOwner: boolean;
  maxExpiryDate: number | null;
};

const PermissionItem: React.FC<PermissionItemProps> = ({
  compact = false,
  clearable = false,
  disable = false,
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
      {clearable && !isCurrUser &&
        <HighlightOffRoundedIcon
          sx={{
            color: COLORS.RED,
          }}
          onClick={() => onClear && onClear(permission)}
        />
      }
      <div
        style={{
          flexGrow: 1,
          marginLeft: (clearable ? '0.5rem' : '0'),
        }}
      >{permission.USER_ID}</div>
      {!compact &&
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <FormControl
            variant='standard'
          >
            <Select
              disabled={disable}
              value={permission.PERMISSION}
              onChange={(event: SelectChangeEvent) => onChangePermissions && onChangePermissions(event)}
            >
              <MenuItem value='DRIVER'>Driver</MenuItem>
              <MenuItem value='MANAGER'>Manager</MenuItem>
              {isUserOwner &&
                <MenuItem value='OWNER'>Owner</MenuItem>
              }
            </Select>
          </FormControl>
          {permission.PERMISSION !== 'OWNER' &&
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Expiry date*"
                value={expiryDate}
                disabled={disable}
                disablePast
                shouldDisableDate={(day: Date) => {
                  if (maxExpiryDate == null) return false;
                  else return (day.valueOf() / 1000 > maxExpiryDate);
                }}
                onChange={(newValue) => {
                  setExpiryDate(newValue);
                  onChangeExpiryDate && onChangeExpiryDate(newValue);
                }}
                renderInput={(params) => 
                  <TextField
                    {...params}
                    sx={{
                      marginTop: '1.2rem',
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
      }
    </div>
  );
};

export default PermissionItem;

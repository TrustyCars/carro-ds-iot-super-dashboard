import React from 'react';
import axios from 'axios';
import {
  AlertColor,
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  Modal,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography } from '@mui/material';
  import { LoadingButton } from '@mui/lab';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { COLORS, ENDPOINT_HOME, ENDPOINT_PATHS } from '../constants';
import { KeypressDeviceProps, UserProps } from '../Keypress';
import SharingSnackbar from './SharingSnackbar';
import PermissionItem from './PermissionItem';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '83%',
  bgcolor: COLORS.WHITE,
  borderRadius: '0.7rem',
  boxShadow: '0px 11px 10px -7px rgb(0 0 0 / 20%), 0px 20px 38px 3px rgb(0 0 0 / 14%), 0px 6px 46px 8px rgb(0 0 0 / 12%)',
  py: 3,
  px: 3,
};

export type PermissionsProps = {
  USER_ID: string;
  PERMISSION: string;
  EXPIRY_DATE: number | null;
};

type SharingModalProps = {
  device: KeypressDeviceProps;
  users: UserProps[];
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SharingModal: React.FC<SharingModalProps> = ({
  device,
  users,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSharingLoading, setIsSharingLoading] = React.useState<boolean>(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarInfo, setSnackbarInfo] = React.useState<{ status: AlertColor; errorMessage?: string; }>({ status: 'success' });

  const [permissions, setPermissions] = React.useState<PermissionsProps[]>([]);

  const [filteredUsers, setFilteredUsers] = React.useState<(UserProps & { label: string })[]>([]);
  const [newUsers, setNewUsers] = React.useState<(UserProps & PermissionsProps)[]>([]);

  const [autocompleteKey, setAutocompleteKey] = React.useState<number>(0);
  const [autocompleteInputValue, setAutocompleteInputValue] = React.useState<string>('');

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.GET_PERMISSIONS, {
      params: { device_id: device.DEVICE_ID },
    }).then(res => {
      setPermissions(res.data.body);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  React.useEffect(() => {
    if (permissions.length && users.length) {
      const permissionUserIds = permissions.map((p: PermissionsProps) => p.USER_ID)
      setFilteredUsers(
        users.filter(u => permissionUserIds.findIndex((p: string) => p === u.USER_ID) === -1).map(u => ({ ...u, label: u.USER_ID })));
      setAutocompleteKey((new Date()).getTime());
    }
  }, [permissions]);

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Share {device.CARPLATE_NO}
          </Typography>
          {isLoading
            ? <div>
                <CircularProgress />
              </div>
            : <>
                <Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />} sx={{ maxHeight: '30vh', overflowY: 'auto' }}>
                  {permissions.length
                    ? permissions.map((p, i) => (
                        <PermissionItem
                          key={i}
                          permission={p}
                          isUserOwner={device.PERMISSION === 'OWNER'}
                          maxExpiryDate={device.EXPIRY_DATE}
                          onChangePermissions={(event: SelectChangeEvent) => {
                            setPermissions(permissions.map(perm => {
                              if (perm.USER_ID === p.USER_ID) {
                                return {
                                  ...perm,
                                  PERMISSION: event.target.value,
                                };
                              }
                              else return perm;
                            }));
                          }}
                          onChangeExpiryDate={(newDate: Date | null) => {
                            setPermissions(permissions.map(perm => {
                              if (perm.USER_ID === p.USER_ID) {
                                return {
                                  ...perm,
                                  EXPIRY_DATE: (newDate ? newDate.valueOf() / 1000 : null),
                                };
                              }
                              else return perm;
                            }));
                          }}
                        />
                      ))
                    : <div>Looks like nobody has permissions to this vehicle.</div>}
                </Stack>
                <div
                  style={{
                    marginBottom: '0.4rem',
                    marginTop: '2rem',
                    marginLeft: '0.1rem',
                    color: '#999',
                  }}
                >Add a new person</div>
                <Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />} sx={{ maxHeight: '25vh', overflowY: 'auto' }}>
                  {newUsers.map((u, i) => (
                    <PermissionItem
                      key={i}
                      permission={{ ...u }}
                      isUserOwner={device.PERMISSION === 'OWNER'}
                      maxExpiryDate={device.EXPIRY_DATE}
                      onChangePermissions={(event: SelectChangeEvent) => {
                        setNewUsers(newUsers.map(new_u => {
                          if (u.USER_ID === new_u.USER_ID) {
                            return {
                              ...new_u,
                              PERMISSION: event.target.value,
                            };
                          }
                          else {
                            return new_u;
                          }
                        }));
                      }}
                      onChangeExpiryDate={(newDate: Date | null) => {
                        setNewUsers(newUsers.map(new_u => {
                          if (u.USER_ID === new_u.USER_ID) {
                            return {
                              ...new_u,
                              EXPIRY_DATE: (newDate ? newDate.valueOf() / 1000 : null),
                            };
                          }
                          else {
                            return new_u;
                          }
                        }));
                      }}
                    />
                  ))}
                </Stack>
                <Autocomplete
                  key={autocompleteKey}
                  sx={{
                    width: '100%',
                    marginTop: '0.5rem',
                  }}
                  options={filteredUsers}
                  inputValue={autocompleteInputValue}
                  onInputChange={(event: any, newValue: string | null) => setAutocompleteInputValue(newValue || '')}
                  onChange={(event: any, newValue: ({ label: string } & UserProps)  | null) => {
                    if (newValue) {
                      setNewUsers([...newUsers,
                        {
                          ...newValue,
                          PERMISSION: 'DRIVER',
                          EXPIRY_DATE: (new Date()).getTime()/1000,
                        }
                      ]);

                      setFilteredUsers(filteredUsers.filter(u => u.USER_ID !== newValue.USER_ID));

                      setAutocompleteInputValue('');
                      setAutocompleteKey((new Date()).getTime());
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Search for a user" variant="filled" />}
                />
                <LoadingButton
                  loading={isSharingLoading}
                  onClick={() => {
                    setIsSharingLoading(true);
                    const payload = [
                      ...(permissions.map(p => ({ USER_ID: p.USER_ID, PERMISSION: p.PERMISSION, EXPIRY_DATE: p.EXPIRY_DATE }))),
                      ...(newUsers.map(u => ({ USER_ID: u.USER_ID, PERMISSION: u.PERMISSION, EXPIRY_DATE: u.EXPIRY_DATE }))),
                    ];

                    axios.post(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.UPDATE_PERMISSIONS,
                      {
                        device_id: device.DEVICE_ID,
                        payload,
                      },
                    ).then(res => {
                      if (res.data.statusCode === 200) {
                        // Permissions update was successful
                        setIsSharingLoading(false);
                        setIsSnackbarOpen(true);
                        setIsModalOpen(false);

                        setPermissions([...permissions, ...newUsers]);
                        setNewUsers([]);
                      }
                      else if (res.data.statusCode === 400) {
                        // Permissions update failed for some reason. Display toast with error message.
                        setIsSharingLoading(false);
                        setIsSnackbarOpen(true);
                        setSnackbarInfo({
                          status: 'error',
                          errorMessage: res.data.body,
                        });
                      }
                    });
                  }}
                  variant="contained"
                  startIcon={
                    <ShareRoundedIcon fontSize='large' />
                  }
                  sx={{
                    padding: '0.5rem 1rem',
                    marginTop: '1.5rem',
                    float: 'right',
                    textTransform: 'none',
                    backgroundColor: COLORS.GREY,
                    color: COLORS.BLACK,
                    ":hover": { backgroundColor: COLORS.GREY, },
                  }}
                >
                  Share
                </LoadingButton>
              </>
          }
        </Box>
      </Modal>
      <SharingSnackbar
        status={snackbarInfo.status}
        errorMessage={snackbarInfo.errorMessage}
        isSnackbarOpen={isSnackbarOpen}
        setIsSnackbarOpen={setIsSnackbarOpen}
      />
    </>
  );
};

export default SharingModal;

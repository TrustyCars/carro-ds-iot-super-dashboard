import React from 'react';
import axios from 'axios';
import {
  AlertColor,
  Autocomplete,
  Box,
  Button,
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
import { JwtTokenContext } from '../App';

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

const stringifyPermissions = (arr: PermissionsProps[]) => {
  return arr.map(r => `${r.USER_ID}_${r.PERMISSION}_${r.EXPIRY_DATE}`).sort().join(',');
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
  const { userId } = React.useContext(JwtTokenContext);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSharingLoading, setIsSharingLoading] = React.useState<boolean>(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarInfo, setSnackbarInfo] = React.useState<{ status: AlertColor; errorMessage?: string; }>({ status: 'success' });

  const [originalPermissions, setOriginalPermissions] = React.useState<PermissionsProps[]>([]);
  const [permissions, setPermissions] = React.useState<PermissionsProps[]>([]);
  const [permissionsToDelete, setPermissionsToDelete] = React.useState<PermissionsProps[]>([]);

  const [filteredUsers, setFilteredUsers] = React.useState<(UserProps & { label: string })[]>([]);
  const [newUsers, setNewUsers] = React.useState<(UserProps & PermissionsProps)[]>([]);

  const [autocompleteKey, setAutocompleteKey] = React.useState<number>(0);
  const [autocompleteInputValue, setAutocompleteInputValue] = React.useState<string>('');

  const [edited, setEdited] = React.useState<boolean>(false);

  React.useEffect(() => {
    axios.get(ENDPOINT_HOME.KEYPRESS_STAGING + ENDPOINT_PATHS.GET_PERMISSIONS, {
      params: { device_id: device.DEVICE_ID },
    }).then(res => {
      // Puts the current user at the top of the permissions list
      const sortedRes = [
        res.data.body.find((p: PermissionsProps) => p.USER_ID === userId),
        ...res.data.body.filter((p: PermissionsProps) => p.USER_ID !== userId),
      ];
      setPermissions(sortedRes);
      setOriginalPermissions(sortedRes);

      setIsLoading(false);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  React.useEffect(() => {
    if (users.length) {
      const filterOutIds = [...permissions, ...newUsers].map((p: PermissionsProps) => p.USER_ID)
      setFilteredUsers(
        users.filter(u => filterOutIds.findIndex((p: string) => p === u.USER_ID) === -1).map(u => ({ ...u, label: u.USER_ID })));
      setAutocompleteKey((new Date()).getTime());
    }
  }, [newUsers, permissions]);

  React.useEffect(() => {
    setEdited(stringifyPermissions(originalPermissions) !== stringifyPermissions([...newUsers, ...permissions, ...permissionsToDelete]));
  }, [newUsers, permissions, permissionsToDelete]);

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <Typography variant="h6" component="h2">
              Share {device.CARPLATE_NO}
            </Typography>
            {edited &&
              <Button
                sx={{
                  textDecoration: 'underline',
                  textTransform: 'none',
                  color: COLORS.GREY,
                }}
                onClick={() => {
                  setPermissions(originalPermissions);
                  setNewUsers([]);
                  setPermissionsToDelete([]);
                }}
              >Reset</Button>
            }
          </div>
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
                          clearable
                          permission={p}
                          disable={p.USER_ID === userId}
                          isCurrUser={p.USER_ID === userId}
                          isUserOwner={device.PERMISSION === 'OWNER'}
                          maxExpiryDate={device.EXPIRY_DATE}
                          onClear={(permission: PermissionsProps) => {
                            setPermissionsToDelete([...permissionsToDelete, permission]);
                            setPermissions(permissions.filter(p => p.USER_ID !== permission.USER_ID));
                          }}
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
                  {permissionsToDelete.length &&
                    <>
                      <div
                        style={{
                          marginBottom: '0.4rem',
                          marginTop: '1rem',
                          marginLeft: '0.1rem',
                          color: COLORS.GREY,
                        }}
                      >Users below will be removed</div>
                      {permissionsToDelete.map((p, i) => (
                        <PermissionItem
                          key={i}
                          compact
                          clearable
                          permission={p}
                          disable
                          isCurrUser={p.USER_ID === userId}
                          isUserOwner={device.PERMISSION === 'OWNER'}
                          maxExpiryDate={device.EXPIRY_DATE}
                          onClear={(permission: PermissionsProps) => {
                            setPermissionsToDelete(permissionsToDelete.filter(p => p.USER_ID !== permission.USER_ID));
                            setPermissions([...permissions, permission]);
                          }}
                        />
                      ))}
                    </>
                  }
                </Stack>
                <div
                  style={{
                    marginBottom: '0.4rem',
                    marginTop: '2rem',
                    marginLeft: '0.1rem',
                    color: COLORS.GREY,
                  }}
                >Add a new person</div>
                <Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />} sx={{ maxHeight: '25vh', overflowY: 'auto' }}>
                  {newUsers.map((u, i) => (
                    <PermissionItem
                      key={i}
                      clearable
                      permission={u}
                      disable={u.USER_ID === userId}
                      isCurrUser={u.USER_ID === userId}
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
                          else return new_u;
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
                          else return new_u;
                        }));
                      }}
                      onClear={(permission: PermissionsProps) => {
                        setNewUsers(newUsers.filter(new_u => (permission.USER_ID !== new_u.USER_ID)));
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
                      ...(permissionsToDelete.map(p => ({ USER_ID: p.USER_ID, PERMISSION: 'EXPIRED', EXPIRY_DATE: null }))),
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
                        setPermissionsToDelete([]);
                        setNewUsers([]);
                        setOriginalPermissions([...newUsers, ...permissions, ...permissionsToDelete]);
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
                    backgroundColor: COLORS.LIGHTGREY,
                    color: COLORS.BLACK,
                    ":hover": { backgroundColor: COLORS.LIGHTGREY, },
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

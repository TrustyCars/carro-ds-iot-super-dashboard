import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LockUnlockHistory from './CarroEverywhere/LockUnlockHistory';
import VoltageLevel from './CarroEverywhere/VoltageLevel';
import RegisterObject from './CarroEverywhere/RegisterObject';
import useWindowDimensions from './hooks/useWindowDimensions';
import { isDesktop } from './utils/utils';
import { COLORS } from './constants';

const CarroEverywhere: React.FC = () => {
  const { width } = useWindowDimensions();
  const [currentMenuItem, setCurrentMenuItem] = React.useState<string>();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  const menuItems: {
    [key: string]: React.ReactElement
  } = {
    '🪵 Command History': <LockUnlockHistory visible={currentMenuItem === '🪵 Command History'} />,
    '🪫 Low Battery Devices': <VoltageLevel visible={currentMenuItem === '🪫 Low Battery Devices'} />,
    '✍🏻 Register Object': <RegisterObject visible={currentMenuItem === '✍🏻 Register Object'} />
  };

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setIsDrawerOpen(open);
    };

  return (
    <>
      {!isDesktop(width) &&
        <MenuRoundedIcon
          onClick={toggleDrawer(true)}
          sx={{ margin: '1rem', cursor: 'pointer', color: COLORS.PRIMARY, }}
          fontSize='large'
        />
      }
      <div
        style={{
          width: '100vw',
          display: 'flex',
        }}
      >
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          width: '30vw',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '30vw',
            margin: '6rem 2rem 2rem 2rem',
            borderRadius: '0.25rem',
            boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
            maxHeight: '100%',
            height: 'fit-content',
            overflowY: 'auto',
          },
        }}
        variant={isDesktop(width) ? 'permanent' : 'temporary'}
        anchor="left"
      >
        <List>
          {Object.keys(menuItems).map((name, i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton
                onClick={() => {
                  setCurrentMenuItem(name);
                  if (!isDesktop(width)) setIsDrawerOpen(false);
                }}
              >
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: (isDesktop(width) ? '2rem' : 0),
          paddingTop: '2rem',
          paddingLeft: (isDesktop(width) ? '2rem' : '1rem'),
        }}
      >
        {currentMenuItem == undefined &&
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                paddingBottom: '2rem',
              }}
            >
              <span
                style={{
                  fontSize: '3rem',
                  marginRight: '1rem',
                }}
              >🤕</span><br />No item is selected. Click on one of the<br />items on the left to view it!</div>
          </div>
        }
        {Object.keys(menuItems).map(name => (
          menuItems[name]
        ))}
      </div>
    </div>
    </>
  );
};

export default CarroEverywhere;

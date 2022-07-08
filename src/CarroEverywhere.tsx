import React from 'react';
import LockUnlockHistory from './CarroEverywhere/LockUnlockHistory';
import VoltageLevel from './CarroEverywhere/VoltageLevel';
import useWindowDimensions from './hooks/useWindowDimensions';

const CarroEverywhere: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        flexDirection: (width < 1200 ? 'column' : 'row'),
      }}
    >
      <VoltageLevel />
      <LockUnlockHistory />
    </div>
  );
};

export default CarroEverywhere;

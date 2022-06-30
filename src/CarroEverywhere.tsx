import React from 'react';
import VoltageLevel from './VoltageLevel';

const CarroEverywhere: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <VoltageLevel />
    </div>
  );
};

export default CarroEverywhere;

import React from 'react';

const InvalidDashboard: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{ fontSize: '5rem' }}
      >🕵🏼</div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '1.4rem',
        }}
      >
        Oops! Looks like you've stumbled onto an invalid dashboard or one <br />
        that you don't have access to. Check your selection (top left!) or contact your <br />
        account administrator to get it sorted out!
      </div>
    </div>
  );
};

export default InvalidDashboard;

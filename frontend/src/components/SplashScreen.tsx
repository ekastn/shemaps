import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f0f0f0', // Light background, adjust as needed
      color: '#333', // Dark text color, adjust as needed
      fontSize: '3em', // Large font size
      fontWeight: 'bold',
      textAlign: 'center',
    }}>
      SheMaps
    </div>
  );
};

export default SplashScreen;
import React from 'react';

const Card = ({ title, value, icon, color = '#4CAF50', bgColor = '#ffffff' }) => {
  return (
    <div
      style={{
        background: bgColor,
        borderRadius: '16px',
        padding: '24px 20px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.07)',
        textAlign: 'center',
        minWidth: '200px',
        flex: 1,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.07)';
      }}
    >
      <div style={{ fontSize: '36px', marginBottom: '12px', color }}>{icon}</div>
      <div style={{ fontSize: '16px', color: '#555', fontWeight: '500' }}>{title}</div>
      <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#222', marginTop: '4px' }}>{value}</div>
    </div>
  );
};

export default Card;


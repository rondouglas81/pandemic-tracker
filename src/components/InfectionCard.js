import React, { Component } from 'react';

const InfectionCard = ({ index, name, color, onDiscard }) => {
  return (
    <div className={`card bg-${color}`} onClick={() => onDiscard(index)}>
      <h1>{name}</h1>
    </div>
  );
};

export default InfectionCard;

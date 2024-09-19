// src/components/Card.js
import React from 'react';
import './Card.css';

const Card = ({ ticket }) => {
  return (
    <div className="card">
      <div className="card-id">{ticket.id}</div>
      <div className="card-title">{ticket.title}</div>
      <div className="card-type">{ticket.type}</div>
    </div>
  );
};

export default Card;

import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../api';
import Column from './Column';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [error, setError] = useState(null); // For handling errors

  useEffect(() => { 
    const getTickets = async () => {
      try {
        const data = await fetchTickets();
        // Check if data.tickets is an array
        if (data && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          setTickets([]); // Set to empty array if the data is invalid
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets");
      }
    };
    getTickets();
  }, []);
  

  const groupTickets = (tickets, groupBy) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const key = ticket[groupBy];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };

  const sortTickets = (tickets, sortBy) => {
    const sorted = {};
    Object.keys(tickets).forEach((key) => {
      sorted[key] = tickets[key].sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priority - a.priority;
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });
    return sorted;
  };

  // Show error message if there was an issue
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const groupedTickets = groupTickets(tickets, groupBy);
  const sortedTickets = sortTickets(groupedTickets, sortBy);

  return (
    <div className="kanban-board">
      <div className="controls">
        <button onClick={() => setGroupBy('status')}>Group by Status</button>
        <button onClick={() => setGroupBy('user')}>Group by User</button>
        <button onClick={() => setGroupBy('priority')}>Group by Priority</button>
        <button onClick={() => setSortBy('priority')}>Sort by Priority</button>
        <button onClick={() => setSortBy('title')}>Sort by Title</button>
      </div>
      <div className="columns">
        {Object.keys(sortedTickets).map((key) => (
          <Column key={key} title={key} tickets={sortedTickets[key]} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

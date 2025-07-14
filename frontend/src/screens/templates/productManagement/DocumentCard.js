
import React, { useState } from 'react';
import './DocumentCard.css';
import { Card } from 'react-bootstrap';

const DocumentCard = ({ title, current, total, details, status, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const toggleExpanded = (e) => {
    if (!e.target.closest('.actions-dropdown')) {
      setIsExpanded(!isExpanded);
    }
  };

  const toggleActions = (e) => {
    e.stopPropagation();
    setIsActionsOpen(!isActionsOpen);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#ffc107';
    }
  };

  return (
    <div className='document-card'>
      <div onClick={toggleExpanded} style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
        <div className="document-info">
          <div style={{ display: "flex", flexDirection:"row", justifyContent:"center", alignItems:"center" }}>
            <button className="plus-icon">
              {isExpanded ? '−' : '+'}
            </button>
            <span className="title">{title}</span>
            <div className="counter">
              <span>{current}/{total}</span>
            </div>
            <span style={{ 
              color: getStatusColor(status),
              marginLeft: '10px',
              fontWeight: 'bold'
            }}>
              {status?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="actions-dropdown">
          <button className="actions-button" onClick={toggleActions}>Actions</button>
          {isActionsOpen && (
            <div className="dropdown-content">
              <button 
                style={{ backgroundColor: "transparent", color: "gray", border: "none" }} 
                onClick={onEdit}
              >
                Edit
              </button>
              <button 
                style={{ backgroundColor: "transparent", color: "red", border: "none" }} 
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <Card className='mt-2' style={{ borderRadius: "10px", width:"100%"}}>
          <Card.Body>
            <div className="details-list">
              {details.map((detail, index) => (
                <div key={index} className="detail-item">
                  <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <button className="small-plus-icon">+</button>
                      <div style={{display:"flex", alignItems:"center"}}>
                        <span style={{fontSize:"12px"}}>Upload {title} -- {detail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default DocumentCard;

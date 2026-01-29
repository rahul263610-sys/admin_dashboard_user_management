import React from 'react';
import '../styles/Loader.css'; 

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  );
};

export default Loader;

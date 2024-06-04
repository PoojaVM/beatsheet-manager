import React from 'react';

const Notify = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseStyle = "fixed bottom-5 right-5 z-50 px-4 py-2 rounded shadow-lg";
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]} animate-slide-in-right`}>
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-white text-lg leading-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Notify;

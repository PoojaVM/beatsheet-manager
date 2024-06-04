
import React from "react";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  }

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{message}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">Are you sure you want to proceed?</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="cancel-button"
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              id="confirm-button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

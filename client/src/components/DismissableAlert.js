import React from "react";
import { CloseIcon, InfoIcon } from "../assets";

const DismissableAlert = ({ message, type = "info", onDismiss }) => {
  const alertClasses = {
    info: " bg-blue-50 text-blue-500",
    success:
      " bg-green-50 text-green-500",
    warning:
      " bg-yellow-50 text-yellow-500",
    error: " bg-red-50 text-red-500",
  };

  const alertCloseBtnClasses = {
    error:
      " bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200",
    info: " bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200",
    success:
      " bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200",
    warning:
      " bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200",
  };

  return (
    <div
      class={"flex items-center p-4 mb-4 rounded-lg" + alertClasses[type]}
      role="alert"
    >
      <InfoIcon />
      <span class="sr-only">{type}</span>
      <div class="ms-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        class={
          "ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8" +
          alertCloseBtnClasses[type]
        }
        aria-label="Close"
        onClick={onDismiss}
      >
        <span class="sr-only">Close</span>
        <CloseIcon />
      </button>
    </div>
  );
};

export default DismissableAlert;

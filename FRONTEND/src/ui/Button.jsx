import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-xl font-semibold shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

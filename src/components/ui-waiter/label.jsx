import React from "react";

export function Label({ className = "", ...props }) {
  return (
    <label
      className={`text-sm font-medium leading-none text-[#2C2C2C] ${className}`}
      {...props}
    />
  );
}


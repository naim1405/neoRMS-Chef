import React from 'react';

export const Input = React.forwardRef(function Input(
  { className = '', type = 'text', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`flex h-10 w-full rounded-md border border-[#FF4D4F] bg-white px-3 py-2 text-sm text-[#2C2C2C] ring-offset-[#FFF5F5] placeholder:text-[#999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});


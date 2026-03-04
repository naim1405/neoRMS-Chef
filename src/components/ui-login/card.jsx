import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-[#FFB3B3] bg-white text-[#2C2C2C] shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
}

export function CardTitle({ className = '', ...props }) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight text-[#2C2C2C] ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = '', ...props }) {
  return (
    <p
      className={`text-sm text-[#999] leading-snug ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}


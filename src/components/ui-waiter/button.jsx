import React from "react";

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4D4F] disabled:pointer-events-none disabled:opacity-60";

const variantClasses = {
  default: "bg-[#FF4D4F] text-white hover:bg-[#FF7F7F] hover:shadow-md",
  outline:
    "border border-[#FF4D4F] bg-white text-[#FF4D4F] hover:bg-[#FFF5F5] hover:text-[#FF7F7F] hover:border-[#FF7F7F]",
  ghost:
    "bg-transparent text-[#FF4D4F] hover:bg-[#FFF5F5] hover:text-[#FF7F7F]",
};

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef(function Button(
  { className = "", variant = "default", size = "default", ...props },
  ref
) {
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.default;

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    />
  );
});


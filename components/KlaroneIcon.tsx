import React from "react";

interface KlaroneIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  className?: string;
  showBackground?: boolean;
}

export function KlaroneIcon({
  className = "w-6 h-6",
  showBackground = false,
  ...props
}: KlaroneIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 50 380 370"
      className={className}
      {...props}
    >
      {/* Optional rounded background container */}
      {showBackground && (
        <rect x="60" y="50" width="380" height="340" rx="40" fill="#141414" />
      )}

      {/* Main outer ring */}
      <circle cx="250" cy="225" r="110" fill="none" stroke="#FFFFFF" strokeWidth="48" />

      {/* Center dot */}
      <circle cx="250" cy="225" r="28" fill="#FFFFFF" />

      {/* Top-right dot */}
      <circle cx="360" cy="95" r="26" fill="#FFFFFF" />

      {/* Bottom smile arc */}
      <path
        d="M 140 350 A 130 130 0 0 0 360 350"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="32"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default KlaroneIcon;

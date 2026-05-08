import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className} group`}>
      <div className="w-11 h-11 bg-primary text-primary-text rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-3xl font-bold">
          location_on
        </span>
      </div>
    </div>
  );
};

export default Logo;

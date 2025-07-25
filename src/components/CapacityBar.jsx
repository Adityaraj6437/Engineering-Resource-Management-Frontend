import React from "react";

const CapacityBar = ({ allocated, available, max }) => {
  const percent = (allocated / max) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-5">
      <div
        className="bg-blue-500 h-full text-xs text-white text-center"
        style={{ width: `${percent}%` }}
      >
        {allocated}% allocated
      </div>
    </div>
  );
};

export default CapacityBar;

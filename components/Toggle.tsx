import React from "react";

interface ToggleProps {
  onLabel: string;
  offLabel: string;
  value: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Toggle = ({ onLabel, offLabel, value, onClick }: ToggleProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-transparent outline-none border-none cursor-pointer hover:underline text-gray-500"
    >
      {value ? onLabel : offLabel}
    </button>
  );
};

export default Toggle;

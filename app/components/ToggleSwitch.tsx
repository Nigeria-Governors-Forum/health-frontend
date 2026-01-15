import React, { useState } from "react";

interface ToggleSwitchProps {
  initial?: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initial = false,
  onToggle,
}) => {
  const [enabled, setEnabled] = useState(initial);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };
  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
        enabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;

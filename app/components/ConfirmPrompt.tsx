import React, { useEffect, useRef } from "react";

interface ConfirmPromptProps {
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
  yesText?: string;
  noText?: string;
}

const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({
  message = "Are you sure?",
  onConfirm,
  onClose,
  yesText = 'Yes',
  noText = 'No',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center space-y-4"
      >
        <p className="text-gray-800 font-medium">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {yesText}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            {noText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPrompt;

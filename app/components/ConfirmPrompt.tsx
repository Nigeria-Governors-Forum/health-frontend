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
  yesText= 'Yes',
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
    <div className="ui:fixed ui:inset-0 ui:z-50 ui:flex ui:items-center ui:justify-center ui:bg-black/50">
      <div
        ref={modalRef}
        className="ui:bg-white ui:p-6 ui:rounded-lg ui:shadow-md ui:w-full ui:max-w-sm ui:text-center ui:space-y-4"
      >
        <p className="ui:text-gray-800 ui:font-medium">{message}</p>
        <div className="ui:flex ui:justify-center ui:gap-4">
          <button
            onClick={onConfirm}
            className="ui:bg-red-500 ui:text-white ui:px-4 ui:py-2 ui:rounded ui:hover:bg-red-600"
          >
            {yesText}
          </button>
          <button
            onClick={onClose}
            className="ui:bg-gray-200 ui:text-gray-700 ui:px-4 ui:py-2 ui:rounded ui:hover:bg-gray-300"
          >
            {noText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPrompt;

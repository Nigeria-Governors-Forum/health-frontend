"use client";

import Image from "next/image";
import React from "react";

interface LoadingScreenProps {
  text?: string;
  fullscreen?: boolean;
  logoSrc?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = "Loading...",
  fullscreen = true,
  logoSrc = "/logo.png",
}) => {
  const containerClass = fullscreen
    ? "fixed inset-0 bg-black/30 z-50"
    : "py-10";

  return (
    <div
      className={`w-full flex items-center justify-center ${containerClass}`}
    >
      <div className="flex flex-col items-center justify-center animate-pulse space-y-4">
        <Image
          src={logoSrc}
          alt="Loading logo"
          width={180}
          height={60}
          className="mx-auto"
          priority
        />
        {text && (
          <span className="text-base sm:text-lg font-semibold text-textRed text-center capitalize">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;

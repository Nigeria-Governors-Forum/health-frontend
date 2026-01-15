"use client";

import Image from "next/image";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

export interface LandingPageProps {
  text?: string;
  fullscreen?: boolean;
  logoSrc?: string;
  copyRight?: boolean;
  username: string;
  password: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  usernameLabel?: string;
  passwordLabel?: string;
  submitLabel?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  text,
  fullscreen,
  logoSrc = "/logo.png",
  copyRight,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loading = false,
  showPassword,
  setShowPassword,
  usernameLabel = "Username",
  passwordLabel = "Password",
  submitLabel = "Proceed",
}) => {
  const dateTime = new Date();

  return (
    <>
      <div className="min-h-screen flex bg-[#DCF5DA] items-center justify-center px-4 py-8">
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
          {/* Left: Logo */}
          <div className="flex items-center justify-center p-6 md:p-10 bg-white">
            <Image
              src={logoSrc}
              alt="NGF Logo"
              width={400}
              height={200}
              className="w-48 md:w-80 object-contain"
              priority
            />
          </div>

          {/* Right: Form */}
          <div className="flex items-center justify-center bg-green-50 p-6 md:p-10">
            <form
              onSubmit={onSubmit}
              className="w-full max-w-sm bg-white p-6 md:p-8 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-bold text-center text-green-800 mb-1">
                Hello! Welcome to
              </h2>
              <p className="text-center text-green-600 font-semibold mb-6">
                {text}
              </p>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {usernameLabel}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={onUsernameChange}
                  placeholder="Enter your username"
                  className="w-full p-3 rounded-md bg-green-50 border border-green-200 text-black placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="mb-6 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {passwordLabel}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={onPasswordChange}
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-md bg-green-50 border border-green-200 text-black placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-9 right-3 cursor-pointer text-green-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded font-semibold transition duration-200 cursor-pointer ${
                  loading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Processing..." : submitLabel}
              </button>

              {copyRight && (
                <p className="text-xs text-center text-gray-400 mt-6">
                  &copy; {dateTime.getFullYear()} NGF
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {loading && <LoadingScreen fullscreen={fullscreen} text="Please wait..." />}
    </>
  );
};

export default LandingPage;

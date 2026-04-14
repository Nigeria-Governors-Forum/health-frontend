"use client";

import Image from "next/image";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from "./loadingScreen";

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
      <div className="ui:min-h-screen ui:flex ui:bg-[#DCF5DA] ui:items-center ui:justify-center ui:px-4 ui:py-8">
        <div className="ui:w-full ui:bg-white ui:rounded-2xl ui:overflow-hidden ui:shadow-xl ui:grid ui:grid-cols-1 ui:md:grid-cols-2">
          {/* Left: Logo */}
          <div className="ui:flex ui:items-center ui:justify-center ui:p-6 ui:md:p-10 ui:bg-white">
            <Image
              src={logoSrc}
              alt="NGF Logo"
              width={400}
              height={200}
              className="ui:w-48 ui:md:w-80 ui:object-contain"
              priority
            />
          </div>

          {/* Right: Form */}
          <div className="fui:lex ui:items-center ui:justify-center ui:bg-green-50 ui:p-6 ui:md:p-10">
            <form
              onSubmit={onSubmit}
              className="ui:w-full ui:max-w-sm ui:bg-white ui:p-6 ui:md:p-8 ui:rounded-xl ui:shadow-md"
            >
              <h2 className="ui:text-xl ui:font-bold ui:text-center ui:text-green-800 ui:mb-1">
                Hello! Welcome to
              </h2>
              <p className="ui:text-center ui:text-green-600 ui:font-semibold ui:mb-6">
                {text}
              </p>

              <div className="ui:mb-4">
                <label htmlFor="username" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                  {usernameLabel}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={onUsernameChange}
                  placeholder="Enter your username"
                  className="ui:w-full ui:p-3 ui:rounded-md ui:bg-green-50 ui:border ui:border-green-200 ui:text-black ui:placeholder-green-700 ui:focus:outline-none ui:focus:ring-2 ui:focus:ring-green-400"
                />
              </div>

              <div className="ui:mb-6 ui:relative">
                <label htmlFor="password" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                  {passwordLabel}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={onPasswordChange}
                  placeholder="Enter your password"
                  className="ui:w-full ui:p-3 ui:rounded-md ui:bg-green-50 ui:border ui:border-green-200 ui:text-black ui:placeholder-green-700 ui:focus:outline-none ui:focus:ring-2 ui:focus:ring-green-400"
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ui:absolute ui:top-9 ui:right-3 ui:cursor-pointer ui:text-green-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`ui:w-full ui:py-2 ui:rounded ui:font-semibold ui:transition ui:duration-200 ui:cursor-pointer ${
                  loading
                    ? "ui:bg-green-300 ui:cursor-not-allowed"
                    : "ui:bg-green-600 ui:hover:bg-green-700 ui:text-white"
                }`}
              >
                {loading ? "Processing..." : submitLabel}
              </button>

              {copyRight && (
                <p className="ui:text-xs ui:text-center ui:text-gray-400 ui:mt-6">
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

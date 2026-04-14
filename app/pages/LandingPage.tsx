"use client";

import Image from "next/image";
import React from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
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
  const h1 = '/svg/h1.svg';
  const h2 = '/svg/h2.svg';

  return (
    // <>
    //   <div className="min-h-screen flex bg-[#f0faf0] items-center justify-center">
    //     <div className="w-full bg-[#002810] h-[600px] md:h-[900px] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
    //       {/* Left: Logo */}
    //       <div className="relative p-6 md:p-10">
    //         {/* Top Left Image */}
    //         <div className="absolute top-0 left-0">
    //           <Image
    //             src={h1}
    //             alt="NGF Logo"
    //             width={400}
    //             height={400}
    //             className="w-[400px] md:w-[600px] object-contain"
    //             priority
    //           />
    //         </div>

    //         {/* Bottom Right Image */}
    //         <div className="absolute bottom-0 right-0">
    //           <Image
    //             src={h2}
    //             alt="NGF Logo"
    //             width={400}
    //             height={200}
    //             className="w-[400px] md:w-[600px]  object-contain"
    //             priority
    //           />
    //         </div>
    //       </div>

    //       {/* Right: Form */}
    //       <div className="flex items-center justify-center bg-[#f0faf0] p-6 md:p-10">
    //         {/* add this on top of part left part in mobile view */}
    //         <form
    //           onSubmit={onSubmit}
    //           className="w-full bg-[#ffffff] px-10 py-6 rounded-xl"
    //         >
    //           <div className="flex items-center justify-center px-6 md:p-10 bg-white">
    //             <Image
    //               src={logoSrc}
    //               alt="NGF Logo"
    //               width={100}
    //               height={50}
    //               className="w-30 md:w-30 object-contain"
    //               priority
    //             />
    //           </div>
    //           <h2 className="text-2xl font-bold text-center text-[#333333] mb-1">
    //             Hello! Welcome to
    //           </h2>
    //           <p className="text-center text-white  text-xl font-semibold mb-6 bg-[#00652E] rounded-xl py-4">
    //             {text}
    //           </p>

    //           <div className="flex items-center justify-center text-[#333333] mb-2">
    //             <hr className="w-1/4" />
    //             <span className="text-center font-medium text-sm text-[#00A141] px-2">
    //               Login with your Credentials
    //             </span>
    //             <hr className="w-1/4" />
    //           </div>

    //           <div className="mb-4">
    //             <label htmlFor="username" className="block text-sm font-medium text-[#333333] mb-1">
    //               {usernameLabel}
    //             </label>
    //             <input
    //               id="username"
    //               name="username"
    //               type="text"
    //               value={username}
    //               onChange={onUsernameChange}
    //               placeholder="@ Username"
    //               className="w-full p-3 rounded-md bg-white border border-[#C2C2C2] text-black focus:outline-none focus:ring-2 focus:ring-green-400"
    //             />
    //           </div>

    //           <div className="mb-6 relative">
    //             <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-1">
    //               {passwordLabel}
    //             </label>
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               id="password"
    //               name="password"
    //               value={password}
    //               onChange={onPasswordChange}
    //               placeholder="🔐 Password"
    //               className="w-full p-3 rounded-md bg-white border border-[#C2C2C2] text-black focus:outline-none focus:ring-2 focus:ring-green-400"
    //             />
    //             <div
    //               onClick={() => setShowPassword((prev) => !prev)}
    //               className="absolute top-9 right-3 cursor-pointer text-[#C2C2C2]"
    //             >
    //               {showPassword ? <FaEyeSlash /> : <FaEye />}
    //             </div>
    //           </div>

    //           <button
    //             type="submit"
    //             disabled={loading}
    //             className={`w-full py-2 rounded font-semibold transition duration-200 cursor-pointer ${loading
    //               ? "bg-[#00A141] cursor-not-allowed"
    //               : "bg-green-600 hover:bg-green-700 text-white"
    //               }`}
    //           >
    //             {loading ? "Processing..." : submitLabel}
    //           </button>

    //           {copyRight && (
    //             <p className="font-light text-xs text-center text-[#333333] mt-6">
    //               &copy; {dateTime.getFullYear()} NGF
    //             </p>
    //           )}
    //         </form>
    //       </div>
    //     </div>
    //   </div>

    //   {loading && <LoadingScreen fullscreen={fullscreen} text="Please wait..." />}
    // </>

    <div className="min-h-screen flex items-center justify-center bg-[#f0faf0]">
      <div className="w-full bg-[#002810] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2 relative min-h-[600px] md:min-h-[900px]">

        {/* LEFT SECTION (Background on mobile) */}
        <div className="absolute inset-0 md:relative">

          {/* Top Left SVG */}
          <div className="absolute top-0 left-0">
            <Image
              src={h1}
              alt="NGF Pattern"
              width={400}
              height={400}
              className="w-[440px] sm:w-[600px] md:w-[650px] object-contain opacity-70 md:opacity-100"
              priority
            />
          </div>

          {/* Bottom Right SVG */}
          <div className="absolute bottom-0 right-0">
            <Image
              src={h2}
              alt="NGF Pattern"
              width={400}
              height={200}
              className="w-[440px] sm:w-[600px] md:w-[650px] object-contain opacity-70 md:opacity-100"
              priority
            />
          </div>
        </div>

        {/* RIGHT SECTION (Form) */}
        <div className="flex items-center justify-end md:justify-center px-4 py-6 md:px-10 relative z-10 lg:bg-[#f0faf0] ">
          <form
            onSubmit={onSubmit}
            className="w-[90%] sm:w-[75%] md:w-full max-w-md bg-white/95 backdrop-blur-sm px-6 py-6 md:px-8 md:py-8 rounded-2xl"
          >

            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <Image
                src={logoSrc}
                alt="NGF Logo"
                width={100}
                height={50}
                className="w-24 object-contain"
                priority
              />
            </div>

            {/* Heading */}
            <h2 className="text-lg md:text-2xl font-bold text-center text-[#333333] mb-1">
              Hello! Welcome to
            </h2>

            <p className="text-center text-white text-sm md:text-lg font-semibold mb-5 bg-[#00652E] rounded-xl py-3 px-2">
              {text}
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center mb-4">
              <hr className="flex-1 border-gray-300" />
              <span className="px-2 text-xs md:text-sm text-[#00A141] whitespace-nowrap">
                Login with your Credentials
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#333333] mb-1">
                {usernameLabel}
              </label>
              <input
                type="text"
                value={username}
                onChange={onUsernameChange}
                placeholder="@ Username"
                className="w-full p-3 rounded-md border border-[#C2C2C2] text-black focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-[#333333] mb-1">
                {passwordLabel}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={onPasswordChange}
                placeholder="🔐 Password"
                className="w-full p-3 pr-10 rounded-md border border-[#C2C2C2] text-black focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              {/* Toggle Icon */}
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-9 right-3 cursor-pointer text-[#C2C2C2]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${loading
                ? "bg-[#00A141] cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              {loading ? "Processing..." : submitLabel}
            </button>

            {/* Footer */}
            {copyRight && (
              <p className="text-xs text-center text-[#333333] mt-6">
                &copy; {dateTime.getFullYear()} NGF
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

// "use client";

// import Image from "next/image";
// import React from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// export interface LandingPageProps {
//   text?: string;
//   fullscreen?: boolean;
//   logoSrc?: string;
//   copyRight?: boolean;
//   username: string;
//   password: string;
//   onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   loading?: boolean;
//   showPassword: boolean;
//   setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
//   usernameLabel?: string;
//   passwordLabel?: string;
//   submitLabel?: string;
// }

// const LandingPage: React.FC<LandingPageProps> = ({
//   text,
//   fullscreen,
//   logoSrc = "/logo.png",
//   copyRight,
//   username,
//   password,
//   onUsernameChange,
//   onPasswordChange,
//   onSubmit,
//   loading = false,
//   showPassword,
//   setShowPassword,
//   usernameLabel = "Username",
//   passwordLabel = "Password",
//   submitLabel = "Proceed",
// }) => {
//   const dateTime = new Date();
//   const h3 = "/cover.png";

//   return (
//     <div className="min-h-screen w-full bg-[#002810] overflow-hidden shadow-xl grid grid-cols-1 relative">
//       {/* Background Image */}
//       <Image
//         src={h3}
//         alt=""
//         fill
//         priority
//         aria-hidden="true"
//         className="object-cover z-0"
//       />

//       {/* (Form) */}
//       <div className="flex items-center md:justify-center px-4 py-6 md:px-10 relative z-10">
//         <form
//           onSubmit={onSubmit}
//           className=" bg-white/95 backdrop-blur-sm px-6 py-6 md:px-8 md:py-8 rounded-2xl"
//         >
//           {/* Logo */}
//           <div className="flex items-center justify-center mb-4">
//             <Image
//               src={logoSrc}
//               alt="NGF Logo"
//               width={100}
//               height={50}
//               className="w-24 object-contain"
//               priority
//             />
//           </div>

//           {/* Heading */}
//           <h2 className="text-lg md:text-2xl font-bold text-center text-[#333333] mb-1">
//             Welcome to the
//           </h2>

//           <p className="text-center text-white text-sm md:text-lg font-semibold mb-5 bg-[#00652E] rounded-xl py-3 px-2">
//             {text}
//           </p>

//           {/* Divider */}
//           <div className="flex items-center justify-center mb-4">
//             <hr className="flex-1 border-gray-300" />
//             <span className="px-2 text-xs md:text-sm text-[#00A141] whitespace-nowrap">
//               Login with your Credentials
//             </span>
//             <hr className="flex-1 border-gray-300" />
//           </div>

//           {/* Username */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-[#333333] mb-1">
//               {usernameLabel}
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={onUsernameChange}
//               placeholder="@ Username"
//               className="w-full p-3 rounded-md border border-[#C2C2C2] text-black focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-6 relative">
//             <label className="block text-sm font-medium text-[#333333] mb-1">
//               {passwordLabel}
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={onPasswordChange}
//               placeholder="🔐 Password"
//               className="w-full p-3 pr-10 rounded-md border border-[#C2C2C2] text-black focus:outline-none focus:ring-2 focus:ring-green-400"
//             />

//             {/* Toggle Icon */}
//             <div
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute top-9 right-3 cursor-pointer text-[#C2C2C2]"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 rounded-xl mb-5">
//             <input
//               type="checkbox"
//               id="keepLoggedIn"
//               className="w-4 h-4 accent-green-600 cursor-pointer"
//             />

//             <label
//               htmlFor="keepLoggedIn"
//               className="text-[#858585] text-sm cursor-pointer"
//             >
//               Keep me logged in
//             </label>
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-lg text-md font-semibold transition duration-200 ${
//               loading
//                 ? "bg-[#00A141] cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700 text-white"
//             }`}
//           >
//             {loading ? "Processing..." : submitLabel}
//           </button>

//           {/* Footer */}
//           {copyRight && (
//             <div className="mx-auto">
//               <p className="text-xs text-center text-[#333333] mt-6">
//                 &copy; {dateTime.getFullYear()} NGF
//               </p>
//               {/* <p className="text-bold text-center text-[#00A141] mt-2 hover:underline">
//                 <button className="text-bold">sign in as a guest</button>
//               </p> */}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

"use client";

import Image from "next/image";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  onGuestSignIn?: () => void;
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
  onGuestSignIn,
  loading = false,
  showPassword,
  setShowPassword,
  usernameLabel = "Username",
  passwordLabel = "Password",
  submitLabel = "Proceed",
}) => {
  const dateTime = new Date();
  const h3 = "/cover.png";

  return (
    <div className="min-h-screen w-full bg-[#002810] overflow-hidden shadow-xl grid grid-cols-1 relative">
      {/* Background Image */}
      <Image
        src={h3}
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover z-0"
      />

      {/* (Form) */}
      <div className="flex items-center md:justify-center px-4 py-6 md:px-10 relative z-10">
        <form
          onSubmit={onSubmit}
          className="bg-white/95 backdrop-blur-sm px-6 py-6 md:px-8 md:py-8 rounded-2xl"
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
            Welcome to the
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

          <div className="flex items-center gap-2 rounded-xl mb-5">
            <input
              type="checkbox"
              id="keepLoggedIn"
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />

            <label
              htmlFor="keepLoggedIn"
              className="text-[#858585] text-sm cursor-pointer"
            >
              Keep me logged in
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-md font-semibold transition duration-200 ${
              loading
                ? "bg-[#00A141] cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Processing..." : submitLabel}
          </button>

          {/* Footer */}
          {copyRight && (
            <div className="mx-auto">
              <p className="text-xs text-center text-[#333333] mt-6">
                &copy; {dateTime.getFullYear()} NGF
              </p>
              <p className="text-bold text-center text-[#00A141] mt-2 hover:underline">
                <button
                type="button"
                onClick={onGuestSignIn}
                className="text-bold cursor-pointer"
              >
                sign in as a guest
              </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
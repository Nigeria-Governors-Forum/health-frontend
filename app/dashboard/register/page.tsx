"use client";

import { useState } from "react";
import { FiUserPlus, FiAtSign, FiMail, FiLock, FiMapPin, FiShield, FiChevronDown } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
// @ts-ignore
import State from "naija-state-local-government";
import toast from "react-hot-toast";
import { Endpoints, httpClient } from "@/app/api-client/src";
import LoadingScreen from "@/app/components/LoadingScreen";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    state: "",
    role: "user", // default
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const roles = [
    { value: "user", label: "User" },
    { value: "gov", label: "Government" },
    { value: "h-admin", label: "Health Admin" },
  ];
  const states = State.states();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.state) {
      setMessage("⚠️ Please fill all fields.");
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Registering...");

      await httpClient.post(Endpoints.auth.register, form);

      toast.success("User registered successfully");
      setMessage("✅ Registration successful!");
      
      // Reset form on success
      setForm({
        username: "",
        email: "",
        password: "",
        state: "",
        role: "user",
      });
    } catch (err: any) {
      setMessage(`❌ Registration failed: ${err.message}`);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-8 md:p-10 w-full max-w-3xl text-gray-900 shadow-sm flex flex-col gap-6">
          
          {/* Header block with green User Badge */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-12 h-12 bg-[#00A141] text-white rounded-xl flex items-center justify-center shadow-md mb-3 transition-transform hover:scale-105">
              <FiUserPlus size={22} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Register a New User
            </h1>
          </div>

          <div className="flex flex-col gap-5">
            {/* Username Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1.5 text-gray-700">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiAtSign size={16} />
                </span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1.5 text-gray-700">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiMail size={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1.5 text-gray-700">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiLock size={16} />
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* State Selection Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1.5 text-gray-700">
                State
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiMapPin size={16} />
                </span>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition"
                >
                  <option value="" className="text-gray-400">State</option>
                  {states.map((state: any) => (
                    <option key={state} value={state} className="text-gray-800">
                      {state}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 text-gray-400 pointer-events-none">
                  <FiChevronDown size={16} />
                </span>
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1.5 text-gray-700">
                Role
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiShield size={16} />
                </span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value} className="text-gray-800">
                      {r.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 text-gray-400 pointer-events-none">
                  <FiChevronDown size={16} />
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#00A141] hover:bg-green-700 disabled:opacity-40 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {loading && <FaSpinner className="animate-spin" size={14} />}
            Register User
          </button>

          {/* Feedback/Response Message */}
          {message && !message.includes("Registering...") && (
            <div
              className={`p-3 rounded-lg text-sm text-center font-medium mt-2 transition ${
                message.startsWith("❌")
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-green-50 text-green-700 border border-green-100"
              }`}
            >
              {message}
            </div>
          )}

        </div>
      </div>
      {loading && <LoadingScreen text="Registering..." />}
    </>
  );
};

export default RegisterPage;

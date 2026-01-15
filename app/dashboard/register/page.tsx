"use client";

import { useState } from "react";
import { FaUserPlus, FaSpinner } from "react-icons/fa";
import State from "naija-state-local-government";
import { Endpoints, httpClient } from "../../../api-client/src";
import LoadingScreen from "@repo/ui/loadingScreen";
import toast from "react-hot-toast";

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

  const roles = ["user", "gov", "h-admin"];
  const states = State.states();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.state) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Registering...");

      const res = await httpClient.post(Endpoints.auth.register, form);

      toast.success("Registration successful");
      setMessage("✅ Registration successful!");
    } catch (err: any) {
      setMessage(`❌ Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-md text-gray-900">
          <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
            <FaUserPlus className="w-6 h-6" /> Register New User
          </h1>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* State */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              State
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-400 rounded-lg bg-white text-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">-- Select State --</option>
              {states.map((state: any) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-400 rounded-lg bg-white text-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin w-5 h-5" />
                Registering...
              </>
            ) : (
              <>
                <FaUserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>

          {/* Message */}
          {message && (
            <pre className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
              {message}
            </pre>
          )}
        </div>
      </div>
      {loading && <LoadingScreen text="Registering..." />}
    </>
  );
};

export default RegisterPage;

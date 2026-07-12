"use client";

import { useState, useEffect } from "react";
import {
  FiUserPlus,
  FiAtSign,
  FiMail,
  FiLock,
  FiMapPin,
  FiShield,
  FiChevronDown,
  FiEdit,
  FiTrash2,
  FiX
} from "react-icons/fi";
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
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const roles = [
    { value: "user", label: "User" },
    { value: "gov", label: "Government" },
    { value: "h-admin", label: "Health Admin" },
    { value: "s-admin", label: "Super Admin" },
  ];
  const states = State.states();

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await httpClient.get<any>(Endpoints.users.list);
      setUsers(response.users || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users list");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      fetchUsers();
    } catch (err: any) {
      setMessage(`❌ Registration failed: ${err.message}`);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (user: any) => {
    setEditingUser(user);
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "", // empty by default for updates
      state: user.state || "",
      role: user.role || "user",
    });
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm({
      username: "",
      email: "",
      password: "",
      state: "",
      role: "user",
    });
    setMessage("");
  };

  const handleUpdate = async () => {
    if (!form.username || !form.email || !form.state) {
      setMessage("⚠️ Username, email and state are required.");
      toast.error("Required fields cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Saving changes...");

      const payload: any = {
        username: form.username,
        email: form.email,
        state: form.state,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await httpClient.put(`${Endpoints.users.list}/${editingUser.id}`, payload);

      toast.success("User updated successfully");
      setMessage("✅ User details updated!");
      handleCancelEdit();
      fetchUsers();
    } catch (err: any) {
      setMessage(`❌ Update failed: ${err.message}`);
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) {
      return;
    }

    try {
      setLoading(true);
      await httpClient.delete(`${Endpoints.users.list}/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
      if (editingUser && editingUser.id === id) {
        handleCancelEdit();
      }
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto min-h-screen text-gray-900">
        
        {/* Left Column - Register/Edit Form */}
        <div className="w-full lg:w-5/12 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col gap-5 self-start">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#00A141] text-white rounded-2xl flex items-center justify-center shadow-md mb-2">
              <FiUserPlus size={22} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {editingUser ? "Edit User Record" : "Register a New User"}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {editingUser ? `Updating account for ${editingUser.username}` : "Create account for a forum participant"}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Username Input */}
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">
                Email Address
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">
                {editingUser ? "New Password (optional)" : "Password"}
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
                  placeholder={editingUser ? "Leave blank to keep same password" : "Password"}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                />
              </div>
            </div>

            {/* State Selection Dropdown */}
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">
                Assigned State
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiMapPin size={16} />
                </span>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition"
                >
                  <option value="" className="text-gray-400">Select State</option>
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
              <label className="text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">
                Access Level (Role)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <FiShield size={16} />
                </span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition"
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

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={editingUser ? handleUpdate : handleRegister}
              disabled={loading}
              className="w-full bg-[#00A141] hover:bg-green-700 disabled:opacity-40 text-white font-semibold py-3 px-6 rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" size={14} />}
              {editingUser ? "Save User Changes" : "Register User"}
            </button>
            {editingUser && (
              <button
                onClick={handleCancelEdit}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <FiX size={14} />
                Cancel Editing
              </button>
            )}
          </div>

          {/* Feedback/Response Message */}
          {message && !message.includes("Saving") && !message.includes("Registering") && (
            <div
              className={`p-3 rounded-lg text-sm text-center font-medium mt-2 border transition ${
                message.startsWith("❌")
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-green-50 text-green-700 border-green-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Right Column - User List */}
        <div className="w-full lg:w-7/12 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                System Users
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage registered user accounts and their role access levels
              </p>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
              {users.length} Users
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
                <FaSpinner className="animate-spin text-green-600" size={24} />
                <span className="text-sm font-medium">Loading users list...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No users found. Register a new user to populate this list.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">User Details</th>
                    <th className="pb-3">State</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u: any) => {
                    const initials = u.username ? u.username.substring(0, 2).toUpperCase() : "US";
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* User Profile info */}
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-[#00A141] font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 text-sm">{u.username}</span>
                              <span className="text-xs text-gray-500">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* State */}
                        <td className="py-4 text-sm font-medium text-gray-600">
                          {u.state || "N/A"}
                        </td>

                        {/* Role badge */}
                        <td className="py-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              u.role === "s-admin"
                                ? "bg-red-50 text-red-700 border-red-100"
                                : u.role === "h-admin"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : u.role === "gov"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-gray-50 text-gray-700 border-gray-100"
                            }`}
                          >
                            {u.role === "s-admin"
                              ? "Super Admin"
                              : u.role === "h-admin"
                              ? "Health Admin"
                              : u.role === "gov"
                              ? "Government"
                              : "Standard User"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right pr-2">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(u)}
                              title="Edit user details"
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-green-100"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(u.id)}
                              title="Delete user account"
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {loading && <LoadingScreen text={editingUser ? "Saving changes..." : "Registering..."} />}
    </>
  );
};

export default RegisterPage;

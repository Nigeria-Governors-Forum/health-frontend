"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Endpoints, httpClient } from "./api-client/src";
import LandingPage from "./pages/LandingPage";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  state: string;
  sub: number;
  username: string;
}
export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  async function fetchData() {
    try {
      const stats: {
        access_token: string;
        user: User;
      } = await httpClient.post(Endpoints.auth.login, {
        email: username,
        password,
      });
      sessionStorage.setItem("token", stats.access_token);
      sessionStorage.setItem("user", JSON.stringify(stats.user));

      router.push("/dashboard");
      toast.success(`Welcome, ${username}!`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  return (
    <>
      <Toaster position="top-right" />
      <LandingPage
        text="Nigeria Governors' Forum Health Dashboard"
        username={username}
        password={password}
        onUsernameChange={handleUsernameChange}
        onPasswordChange={handlePasswordChange}
        onSubmit={handleSubmit}
        loading={loading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        usernameLabel="Username"
        passwordLabel="Passcode"
        submitLabel="Sign In"
        copyRight={true}
      />
    </>
  );
}

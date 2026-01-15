"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export function useTopbarFilters() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const router = useRouter();

  console.log("selectedState", selectedState, "selectedYear", selectedYear);
  

  useEffect(() => {
    const userProfile = sessionStorage.getItem("user");
    if (!userProfile) {
      console.warn("No user profile found, redirecting to login...");
      router.push("/login");
      return;
    }

    try {
      const parsedUserProfile = JSON.parse(userProfile);
      // console.log("parsedUserProfile", parsedUserProfile);

      // Optional: if profile is empty, also redirect
      if (Object.keys(parsedUserProfile).length === 0) {
        router.push("/login");
      }
      setSelectedState(parsedUserProfile.state || "");
    } catch (err) {
      console.error("Invalid user profile in sessionStorage", err);
      router.push("/login");
    }
  }, [router]);

  return {
    selectedState,
    setSelectedState,
    selectedYear,
    setSelectedYear,};
}

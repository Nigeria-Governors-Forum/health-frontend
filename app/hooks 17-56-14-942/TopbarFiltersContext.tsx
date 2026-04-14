"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};
interface TopbarFiltersContextType {
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  showConfirm: boolean;
  setShowConfirm: (confirm: boolean) => void;
}

const TopbarFiltersContext = createContext<
  TopbarFiltersContextType | undefined
>(undefined);

export function TopbarFiltersProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userProfile = sessionStorage.getItem("user");
    if (!userProfile) {
      router.push("/");
      return;
    }

    try {
      const parsedUserProfile = JSON.parse(userProfile);
      if (Object.keys(parsedUserProfile).length === 0) {
        router.push("/");
      }
      setSelectedState(parsedUserProfile.state || "");
    } catch {
      router.push("/");
    }
  }, [router]);

  return (
    <TopbarFiltersContext.Provider
      value={{
        selectedState,
        setSelectedState,
        selectedYear,
        setSelectedYear,
        selectedZone,
        setSelectedZone,
        showConfirm,
        setShowConfirm,
      }}
    >
      {children}
    </TopbarFiltersContext.Provider>
  );
}

export function useTopbarFilters() {
  const ctx = useContext(TopbarFiltersContext);
  if (!ctx) {
    throw new Error(
      "useTopbarFilters must be used inside TopbarFiltersProvider"
    );
  }
  return ctx;
}

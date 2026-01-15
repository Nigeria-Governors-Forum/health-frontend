"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";
// @ts-ignore
import State from "naija-state-local-government";
import "leaflet/dist/leaflet.css";

import Topbar from "../components/Topbar";
import { TopbarFiltersProvider, useTopbarFilters } from "../context/TopbarFiltersContext";
import Sidebar from "../components/Sidebar";

const stateLogos: Record<string, string> = {
  Abia: "/map/NGAB.svg",
  Adamawa: "/map/NGAD.svg",
  "Akwa Ibom": "/map/NGAK.svg",
  Anambra: "/map/NGAN.svg",
  Bauchi: "/map/NGBA.svg",
  Bayelsa: "/map/NGBY.svg",
  Benue: "/map/NGBE.svg",
  Borno: "/map/NGBR.svg",
  "Cross River": "/map/NGRI.svg",
  Delta: "/map/NGDE.svg",
  Ebonyi: "/map/NGEB.svg",
  Edo: "/map/NGED.svg",
  Ekiti: "/map/NGEK.svg",
  Enugu: "/map/NGEN.svg",
  Gombe: "/map/NGGO.svg",
  Imo: "/map/NGIM.svg",
  Jigawa: "/map/NGJI.svg",
  Kaduna: "/map/NGKD.svg",
  Kano: "/map/NGKN.svg",
  Katsina: "/map/NGKT.svg",
  Kebbi: "/map/NGKE.svg",
  Kogi: "/map/NGKO.svg",
  Kwara: "/map/NGKW.svg",
  Lagos: "/map/NGLA.svg",
  Nassarawa: "/map/NGNA.svg",
  Nasarawa: "/map/NGNA.svg",
  Niger: "/map/NGNI.svg",
  Ogun: "/map/NGOG.svg",
  Ondo: "/map/NGON.svg",
  Osun: "/map/NGOS.svg",
  Oyo: "/map/NGOY.svg",
  Plateau: "/map/NGPL.svg",
  Rivers: "/map/NGRI.svg",
  Sokoto: "/map/NGSO.svg",
  Taraba: "/map/NGTA.svg",
  Yobe: "/map/NGYO.svg",
  Zamfara: "/map/NGZA.svg",
  "Federal Capital Territory": "/map/NGFC.svg", // Federal Capital Territory (Abuja)
};

const metadata: Metadata = {
  title: "NGF Health Desk",
  description: "Created by Opemipo Alomaja",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      // localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <>
      <Toaster position="top-right" />

      <div
        className="flex min-h-screen bg-ngfGreen transition-all duration-300 ease-in-out"
        style={{ "--sidebar-width": `${sidebarWidth}px` } as any}
      >
        {/* Sidebar */}
        <div
          aria-label="sidebar-wrapper"
          className={`
            fixed left-0 top-0 h-full z-10 transition-all duration-300 bg-white shadow
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          `}
          style={{ width: sidebarWidth }}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </div>

        {/* Main area */}
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out md:ml-[var(--sidebar-width)]">
          <TopbarFiltersProvider>
            <TopbarWithFilters
              collapsed={collapsed}
              onToggleSidebar={() => setMobileOpen((o) => !o)}
            />
            <main className="p-4">{children}</main>
          </TopbarFiltersProvider>
        </div>
      </div>
    </>
  );
}

function TopbarWithFilters({
  collapsed,
  onToggleSidebar,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const { setSelectedState, setSelectedYear } = useTopbarFilters();

  return (
    <Topbar
      collapsed={collapsed}
      headerHeight="h-28"
      logos={stateLogos}
      state={State.states()}
      onToggleSidebar={onToggleSidebar}
      onStateChange={setSelectedState}
      onYearChange={setSelectedYear}
      showLogout={false}
    />
  );
}
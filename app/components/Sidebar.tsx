"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaMoneyCheck,
  FaSignOutAlt,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import ConfirmPrompt from "./ConfirmPrompt";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface NavItem {
  href?: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
  children?: NavItem[]; // ✅ add nested items
}

export const HealthIcon: any = "/svg/healthIcon.svg";
export const AgricIcon: any = "/svg/agricIcon.svg";
export const EducationIcon: any = "/svg/eduIcon.svg";

export const navItem: NavItem[] = [
  {
    label: "Health",
    icon: HealthIcon,
    roles: ["user", "h-admin", "s-admin"],
    children: [
      {
        href: "/dashboard/",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/demography",
        icon: <FaMoneyCheck />,
        label: "Demography",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/health-facilities",
        icon: <FaMoneyCheck />,
        label: "Health Facilities",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/zonal-health-facilities",
        icon: <FaMoneyCheck />,
        label: "Zonal Health Facilities",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/human-resource",
        icon: <FaMoneyCheck />,
        label: "Human Resource",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/health-finance",
        icon: <FaMoneyCheck />,
        label: "Health Finance",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/zonal-health-finance",
        icon: <FaMoneyCheck />,
        label: "Zonal Health Finance",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/score-card",
        icon: <FaMoneyCheck />,
        label: "Score Cards",
        roles: ["user", "h-admin", "s-admin"],
      },
      {
        href: "/dashboard/upload-data",
        icon: <FaMoneyCheck />,
        label: "Data Upload",
        roles: ["h-admin", "s-admin", "s-admin"],
      },
      {
        href: "/dashboard/register",
        icon: <FaMoneyCheck />,
        label: "Register User",
        roles: ["h-admin", "s-admin", "s-admin"],
      },
    ],
  },
  {
    // href: "https://ngf-frontend-agric.vercel.app/",
    href: "https://asc.education.gov.ng/dhis/dhis-web-commons/security/login.action",
    icon: AgricIcon,
    label: "Agriculture",
    roles: ["user", "acct", "audit", "h-admin", "s-admin"],
  },
  {
    href: "https://ngf-frontend-agric.vercel.app/",
    icon: EducationIcon,
    label: "Education",
    roles: ["user", "acct", "audit", "h-admin", "s-admin"],
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  navItems = navItem,
}) => {
  // const { showConfirm, setShowConfirm } = useTopbarFilters();

  const [role, setRole] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const pathname = usePathname();

  const normalizePath = (p: string) => {
    if (!p) return "/";
    return p.replace(/\/+$/, "") || "/";
  };

  useEffect(() => {
    // Replace with real auth lookup
    const user = sessionStorage.getItem("user");
    const parsedUser = JSON.parse(user ?? "{}");
    // console.log("role", parsedUser.role);

    setRole(parsedUser.role);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((o: boolean) => !o);
  }, [setMobileOpen]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  const filteredNav = navItems
    .map((item) => {
      if (item.children) {
        // filter children by role
        const allowedChildren = item.children.filter((child) =>
          child.roles.includes(role!),
        );

        // keep parent only if it has visible children
        if (allowedChildren.length > 0) {
          return { ...item, children: allowedChildren };
        }
        return null;
      }

      // normal single item
      return item.roles.includes(role!) ? item : null;
    })
    .filter(Boolean) as NavItem[];

  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") return pathname === href;
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const handleLogout = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const confirmLogout = () => {
    setShowConfirm(false);
  };
  const cancelPrompt = () => {
    setShowConfirm(false);
  };

  const toggleExpand = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleMobile}
        className="md:hidden fixed top-4 right-4 z-50 bg-white text-[#06923E] p-2 rounded"
      >
        <FaTimes size={24} />
      </button>

      {/* Sidebar container */}
      <div
        aria-label="Sidebar"
        className={cn(
          "fixed top-0 left-0 h-screen bg-white text-black p-4 z-40 flex flex-col justify-between transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div>
          {/* Collapse toggle (desktop) */}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center absolute top-4 right-[-16px] text-white bg-[#06923E] border border-white rounded-full w-8 h-8 z-50 shadow"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          {/* Logo */}
          <div className={cn("flex", collapsed ? "py-2" : "py-5")}>
            <Image
              src="/logo.png"
              alt="NGF Logo"
              width={collapsed ? 70 : 180}
              height={collapsed ? 70 : 60}
              priority
              className={cn(
                "object-contain transition-all duration-300 h-auto",
                collapsed ? "w-10" : "w-36",
              )}
            />
          </div>

          {filteredNav.map((item) => {
            if (item.children && item.children.length > 0) {
              const isOpen = expanded[item.label];
              return (
                <div key={item.label} className="space-y-1">
                  {/* Parent item */}
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-[#00A141] hover:text-white cursor-pointer "
                  >
                    <div className="flex items-center space-x-2">
                      {typeof item.icon === "string" ? (
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={collapsed ? 20 : 24}
                          height={collapsed ? 20 : 24}
                          priority
                          className={cn(
                            "object-contain transition-all duration-300 h-auto text-black brightness-0 hover:invert ",
                            collapsed ? "w-5" : "w-6",
                          )}
                        />
                      ) : (
                        <span>{item.icon as React.ReactNode}</span>
                      )}
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <span>
                        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </button>

                  {/* Children */}
                  {isOpen && !collapsed && (
                    <div className="ml-6 flex flex-col space-y-1">
                      {item.children.map((child) => {
                        const isActive =
                          pathname === child.href ||
                          pathname.startsWith(child.href + "/");

                        return (
                          <Link
                            key={child.label}
                            href={child.href!}
                            className={`p-2 rounded flex items-center space-x-2 hover:bg-[#00A141] hover:text-white ${isActive ? "bg-[#00A141] text-white" : ""
                              }`}
                            onClick={closeMobile}
                          >
                            {typeof child.icon === "string" ? (
                              <Image
                                src={child.icon}
                                alt={child.label}
                                width={20}
                                height={20}
                                priority
                                className="object-contain transition-all duration-300 h-auto w-5"
                              />
                            ) : (
                              <span>{child.icon as React.ReactNode}</span>
                            )}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal single item
            const isActive = pathname === item.href;
            return (
              <Link
                target="_blank"
                key={item.label}
                href={item.href!}
                className={`p-2 rounded flex items-center space-x-2 hover:bg-[#009B72] hover:text-white ${isActive ? "bg-[#009B72] text-white" : ""
                  }`}
                onClick={closeMobile}
              >
                {typeof item.icon === "string" ? (
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={collapsed ? 20 : 24}
                    height={collapsed ? 20 : 24}
                    priority
                    className={cn(
                      "object-contain transition-all duration-300 h-auto",
                      collapsed ? "w-5" : "w-6",
                    )}
                  />
                ) : (
                  <span>{item.icon as React.ReactNode}</span>
                )}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer with logout */}
        <div className="mt-4 border-t border-white/30 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-[#00A141] hover:text-white outline-none"
            aria-label="Logout"
          >
            <FaSignOutAlt className="text-xl" />
            {!collapsed && (
              <span className="ml-2 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={closeMobile}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}

      {showConfirm && (
        <ConfirmPrompt
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onClose={cancelPrompt}
        />
      )}
    </>
  );
};

export default Sidebar;

"use client";
import Link from "next/link";
import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { redirect, usePathname } from "next/navigation";
import { ColorToggle } from "./colorMode";
import { Button } from "./ui/button";
import { GoPersonFill } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function logoutHandler() {
  // call /login/out
  fetch("/login/out", {
    method: "POST",
  })
    .then((res) => {
      res.text().then((data) => data !== "no" && "ok");
    })
    .catch((err) => {
      console.error(err);
    });
  window.location.replace("/login");
}

export default function Header() {
  // get current page
  const basePath = usePathname().split("/")[1];
  const [activeNavItem, setActiveNavItem] = useState<string | null>(basePath);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const navItems = [
    { id: "dashboard", label: "Overview" },
    { id: "containers", label: "Containers" },
  ];
  const handleNavItemClick = (navId: string) => {
    setActiveNavItem(navId);
    setHoveredNavItem(null);
  };
  const handleNavItemHover = (navId: string) => {
    setHoveredNavItem(navId);
  };
  const handleNavItemMouseLeave = () => {
    setHoveredNavItem(null);
  };
  return (
    <div className="w-full border-b-2 dark:border-gray-800 pb-2">
      <div className="h-24"></div>
      <nav className=" sticky top-0 container mx-auto flex justify-between items-center dark:text-white text-black dark:border-gray-800 max-w-screen-2xl header-hide-scrollbar">
        <ul className="flex flex-1">
          {navItems.map((nav) => (
            <Link
              key={nav.id}
              href={`/${nav.id}`}
              className={`relative z-20  ${
                activeNavItem === nav.id
                  ? "dark:text-gray-200 text-gray-900"
                  : "text-gray-500"
              }`}
            >
              <li
                onClick={() => handleNavItemClick(nav.id)}
                onMouseMove={() => handleNavItemHover(nav.id)}
                onMouseLeave={handleNavItemMouseLeave}
                className="relative px-4 py-2 transition-colors"
              >
                {nav.label}
                {hoveredNavItem === nav.id && (
                  <motion.span
                    layoutId="hover"
                    transition={{ type: "spring", duration: 0.3 }}
                    className="absolute inset-0 -z-10 bg-slate-300/30 dark:bg-slate-900/30 rounded-lg"
                  ></motion.span>
                )}
                {activeNavItem === nav.id && (
                  <motion.span
                    layoutId="active"
                    transition={{ type: "spring", duration: 0.5 }}
                    className="z-50 inset-0 absolute border-b-2 -mb-2.5 border-black dark:border-gray-200"
                  ></motion.span>
                )}
              </li>
            </Link>
          ))}
        </ul>
        <DropdownMenu>
          <ColorToggle className="mr-2" />
          <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 p-0 rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
            <GoPersonFill className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => logoutHandler()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </nav>
    </div>
  );
}

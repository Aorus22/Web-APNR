"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "@/constant/menuitems";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, className }) {
  const currentPath = usePathname();
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    const currentMenu = menuItems.find((item) => item.url === currentPath)
    setActive(currentMenu?.name ?? "");
  }, [currentPath])

  return (
    <div
      className={`
        ${isSidebarOpen ? "w-full sm:w-64" : "w-0 invisible sm:visible sm:w-20"} 
        fixed top-0 left-0 h-full bg-white border p-4 transition-all duration-300 z-50
        ${className}
      `}
    >
      <div className={`${isSidebarOpen ? "sm:block" : "hidden sm:block"}`}>
        <Link
          href={'/'}
          className="block w-full text-4xl font-extrabold cursor-pointer mb-6 text-center transition-transform transform hover:scale-110 hover:text-indigo-500"
        >
          <div className="flex w-full justify-center items-center">
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              A
            </span>
            <span className={`${isSidebarOpen ? "" : "hidden" } bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 bg-clip-text text-transparent`}>
              PNR
            </span>
          </div>
        </Link>

        <div className="sm:hidden w-full flex justify-center items-center">
          <button
            className="text-gray-600 focus:outline-none mb-6"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <ul className="space-y-4">
          {menuItems
            .filter((item) => item.name.trim() !== "")
            .map((item) => (
              <li key={item.name}>
                <Link
                  href={item.url}
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex sm:justify-start justify-center items-center space-x-4 p-3 rounded-lg cursor-pointer
                    ${
                      active === item.name
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-lg font-medium">{item.icon}</span>
                  <div>
                    {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                  </div>
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

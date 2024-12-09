"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { menuItems } from "@/constant/menuitems";
import { FaTimes, FaBars, FaArrowLeft } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoMdExit } from "react-icons/io";
import { useState } from "react";
import { UserAuth } from "@/context/authContext";

export default function TopBar({ isSidebarOpen, setIsSidebarOpen, className }) {
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = UserAuth()

  const activeMenuItem = menuItems.find((item) => {
    if (item.name.trim() === "") {
      return currentPath.startsWith(item.url.split("/:")[0]);
    }
    return item.url === currentPath;
  });

  return (
    <div
      className={`
        fixed flex items-center justify-between bg-white py-4 border-b !w-full z-10 px-6 
        ${isSidebarOpen ? "sm:pr-72" : "sm:pr-24"}
        ${className}
      }`}
    >

      <div className="flex sm:hidden justify-center items-center">
        <button
          className="text-gray-600 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>        
      </div>

      <div className="text-lg font-semibold text-indigo-900 flex items-center gap-3">
        <button className="hidden sm:block">
          {isSidebarOpen ? (
            <GoSidebarExpand size={24} onClick={() => {setIsSidebarOpen(false)} }/>
          ) : (
            <GoSidebarCollapse size={24} onClick={() => {setIsSidebarOpen(true)} }/>
          )}
        </button>
        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
        {activeMenuItem ? activeMenuItem.title : "Page Not Found"}
      </div>

      <div 
        className="relative flex items-center space-x-4 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Image
          src={`${user?.photoUrl || "/profile.jpg"}`}
          alt="Profile"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-right hidden md:block">
          <p className="text-left text-sm font-medium text-gray-900">{user?.name || ""}</p>
          <p className="text-xs text-gray-500">{user?.email || ""}</p>
        </div>

        {isMenuOpen && (
        <div className="absolute right-0 top-12 mt-2 bg-white shadow-lg rounded-md p-2 w-auto">
          <div className="px-4 py-2 md:hidden border-b-2">
            <p className="text-left text-sm font-medium text-gray-900">{user?.name || ""}</p>
            <p className="text-xs text-gray-500">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2 text-left w-full gap-2"
          >
              <IoMdExit size={23} />
            Log Out
          </button>
        </div>
      )}
      </div>

    </div>
  );
}

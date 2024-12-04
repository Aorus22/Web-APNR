"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { menuItems } from "@/constant/menuitems";
import { FaTimes, FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserAuth } from "@/context/authContext";

export default function TopBar({ isSidebarOpen, setIsSidebarOpen, className }) {
  const currentPath = usePathname();
  const currentItem = menuItems.find(item => item.url === currentPath);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = UserAuth()

  return (
    <div
      className={`
        fixed flex items-center justify-between bg-white py-4 shadow-md w-screen z-10 px-6 
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

      <div className="text-lg font-semibold text-indigo-900">
        {currentItem ? currentItem.title : "Page Not Found"}
        {/* {JSON.stringify(user.uid)} */}
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
        <div className="text-right hidden sm:block">
          <p className="text-left text-sm font-medium text-gray-900">{user?.name || ""}</p>
          <p className="text-xs text-gray-500">{user?.email || ""}</p>
        </div>

        {isMenuOpen && (
        <div className="absolute right- top-12 mt-2 bg-white shadow-lg rounded-md p-2 w-40">
          <button
            onClick={handleLogout}
            className="block text-gray-700 hover:bg-gray-200 px-4 py-2 text-left w-full"
          >
            Log Out
          </button>
        </div>
      )}
      </div>

    </div>
  );
}

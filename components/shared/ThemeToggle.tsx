"use client";
import { useEffect, useState } from "react";

import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

export const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="relative flex items-center dark:bg-gray-900 bg-primary-500 cursor-pointer rounded-full"
      onClick={() => setDarkMode(!darkMode)}
    >
      <div
        className="absolute bg-white dark:bg-primary w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center"
        // style={darkMode ? { left: "2px" } : { right: "2px" }}
      >
        {darkMode ? (
          <FaMoon className="text-black" size={12} />
        ) : (
          <BsSunFill className="text-black" size={12} />
        )}
      </div>
    </div>
  );
};

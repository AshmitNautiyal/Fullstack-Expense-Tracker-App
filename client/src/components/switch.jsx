import React, { useState } from "react";
import useStore from "../store";

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore((state) => state);
  
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
        isDarkMode ? "bg-violet-700" : "bg-gray-300"
      }`}
      onClick={toggleTheme}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 bg-white ${
          isDarkMode ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </div>
  );
};

export default ThemeSwitch;
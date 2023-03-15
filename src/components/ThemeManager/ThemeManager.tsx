import { getCookie, setCookie } from "cookies-next";
import React, { useContext, useEffect, useState } from "react";
import { ColorTheme } from "../../types/types";

const ThemeContext = React.createContext({
  theme: "dark",
  toggleTheme: () => {
    return;
  },
});

export default function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ColorTheme>("dark");

  useEffect(() => {
    setTheme(getCookie("color-theme") as ColorTheme);
  }, []);

  const toggleTheme = (value?: ColorTheme) => {
    const nextColorTheme = value || (theme === "dark" ? "light" : "dark");

    setTheme(nextColorTheme);
    setCookie("color-theme", nextColorTheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}

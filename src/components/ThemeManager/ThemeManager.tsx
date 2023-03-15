import { getCookie, setCookie } from "cookies-next";
import React, { useContext, useState } from "react";
import { ColorTheme } from "../../types/types";

const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {
    return;
  },
});

export default function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ColorTheme>(
    (getCookie("color-scheme") as ColorTheme) ?? "light"
  );

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

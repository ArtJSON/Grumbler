import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next";

import { api } from "../utils/api";

import "../styles/globals.scss";
import { useState } from "react";
import { ColorTheme } from "../types/types";
import React from "react";
import { Layout } from "../components/Layout/Layout";

const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
});

const MyApp: AppType<{
  session: Session | null;
  cookieTheme: "dark" | "light";
}> = ({ Component, pageProps: { cookieTheme, session, ...pageProps } }) => {
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
    <SessionProvider session={session}>
      <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

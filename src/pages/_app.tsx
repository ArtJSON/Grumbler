import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next";

import { api } from "../utils/api";

import "../styles/globals.css";
import { useState } from "react";
import { ColorTheme } from "../types/ColorTheme";

const MyApp: AppType<{
  session: Session | null;
  cookieColorScheme: "dark" | "light";
}> = ({
  Component,
  pageProps: { cookieColorScheme, session, ...pageProps },
}) => {
  const [colorScheme, setColorScheme] = useState<ColorTheme>(
    (getCookie("color-scheme") as ColorTheme) ?? "light"
  );

  const toggleColorScheme = (value?: ColorTheme) => {
    const nextColorTheme = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorTheme);
    setCookie("color-theme", nextColorTheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

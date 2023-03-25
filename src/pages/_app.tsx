import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.scss";
import React from "react";
import { Layout } from "../components/Layout/Layout";
import RouteGuard from "../components/RouteGuard/RouteGuard";
import ThemeManager from "../components/ThemeManager/ThemeManager";

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ThemeManager>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeManager>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

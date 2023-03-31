import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.scss";
import React from "react";
import { Layout } from "../components/Layout";
import RouteGuard from "../components/RouteGuard";
import ThemeManager from "../components/ThemeManager";

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <RouteGuard>
        <ThemeManager>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeManager>
      </RouteGuard>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

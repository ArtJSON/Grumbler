import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.scss";
import React from "react";
import { Layout } from "../components/Layout/Layout";
import { MantineProvider } from "@mantine/core";
import RouteGuard from "../components/RouteGuard/RouteGuard";
import ThemeManager from "../components/ThemeManager/ThemeManager";

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <RouteGuard>
        <ThemeManager>
          <MantineProvider
            theme={{
              fontFamily: "Roboto Flex, sans-serif",
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MantineProvider>
        </ThemeManager>
      </RouteGuard>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

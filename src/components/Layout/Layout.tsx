import {
  AppShell,
  Burger,
  Button,
  Container,
  Flex,
  Header,
  MediaQuery,
  Navbar,
  Text,
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Brightness, Login } from "tabler-icons-react";
import { useThemeContext } from "../ThemeManager/ThemeManager";
import { MainLinks } from "./MainLinks/MainLinks";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data } = useSession();
  const theme = useThemeContext();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      setOpened(false);
    }
  }, [router.pathname]);

  return (
    <AppShell
      padding={0}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 300, lg: 300 }}
        >
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Navbar.Section py={16}>
              <Text
                size={36}
                style={{ fontFamily: "Big Shoulders Display, cursive" }}
                align="center"
              >
                Grumbler
              </Text>
            </Navbar.Section>
          </MediaQuery>
          <Navbar.Section grow mt="md">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <Flex justify="space-between" gap={8}>
              {data?.user ? (
                <Button
                  style={{ flexGrow: 1 }}
                  onClick={() => {
                    signOut({
                      callbackUrl: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout`,
                    });
                  }}
                >
                  <Login size="1.25rem" style={{ marginRight: 4 }} />
                  <span>Sign out</span>
                </Button>
              ) : (
                <Button
                  style={{ flexGrow: 1 }}
                  onClick={() => {
                    signIn();
                  }}
                >
                  <Login size="1.25rem" style={{ marginRight: 4 }} />
                  <span>Sign in</span>
                </Button>
              )}

              <Button
                onClick={() => {
                  theme.toggleTheme();
                }}
                style={{ flexGrow: 1 }}
              >
                <Brightness size="1.25rem" style={{ marginRight: 4 }} />
                <span>Theme</span>
              </Button>
            </Flex>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Header height={{ base: 48, sm: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                height: "100%",
              }}
            >
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size={24}
                mr="xl"
                pos="absolute"
                top={8}
                left={8}
              />
              <Text
                size={24}
                style={{
                  fontFamily: "Big Shoulders Display, cursive",
                }}
                align="center"
              >
                Grumbler
              </Text>
            </div>
          </Header>
        </MediaQuery>
      }
    >
      {router.pathname.split("/")[1] === "admin" ? (
        <>{children}</>
      ) : (
        <Container mih="100lvh">{children}</Container>
      )}
    </AppShell>
  );
}

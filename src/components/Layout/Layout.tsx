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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Brightness, Login } from "tabler-icons-react";
import { useThemeContext } from "../ThemeManager/ThemeManager";
import { MainLinks } from "./MainLinks/MainLinks";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
          <Navbar.Section>
            <Text size="xl">Grumbler</Text>
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <Flex justify="space-between" gap={8}>
              <Button style={{ flexGrow: 1 }}>
                <Login size="1.25rem" style={{ marginRight: 4 }} />
                <span>Sign out</span>
              </Button>
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
          <Header height={{ base: 50, sm: 0 }} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </div>
          </Header>
        </MediaQuery>
      }
    >
      {router.pathname.split("/")[1] === "admin" ? (
        <>{children}</>
      ) : (
        <Container>{children}</Container>
      )}
    </AppShell>
  );
}

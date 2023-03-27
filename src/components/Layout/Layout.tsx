import { AppShell, Button, Container, Flex, Navbar, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { Brightness, Login } from "tabler-icons-react";
import { useThemeContext } from "../ThemeManager/ThemeManager";
import { MainLinks } from "./MainLinks/MainLinks";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const theme = useThemeContext();

  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
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
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {router.pathname.split("/")[1] === "admin" ? (
        <>{children}</>
      ) : (
        <Container>{children}</Container>
      )}
    </AppShell>
  );
}

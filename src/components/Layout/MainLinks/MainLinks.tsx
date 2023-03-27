import { Group, NavLink, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowBackUp,
  Flag,
  Home,
  ServerCog,
  Settings,
  TrendingUp,
  Users,
} from "tabler-icons-react";
import { useRouter } from "next/router";

interface MainLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function MainLink({ icon, label, href }: MainLinkProps) {
  return (
    <NavLink
      component={Link}
      label={
        <Group>
          {icon}
          <Text size="lg">{label}</Text>
        </Group>
      }
      href={href}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    />
  );
}

export function MainLinks() {
  const session = useSession();
  const router = useRouter();

  const adminPanelLinks = [
    {
      icon: <ArrowBackUp size="2rem" strokeWidth={1} />,
      label: "Main application",
      href: "/",
    },
    {
      icon: <Flag size="2rem" strokeWidth={1} />,
      label: "Resolve reports",
      href: "/admin/reports",
    },
    {
      icon: <Users size="2rem" strokeWidth={1} />,
      label: "Manage users",
      href: "/admin/users",
    },
  ];

  const adminLinks = [
    {
      icon: <Home size="2rem" strokeWidth={1} />,
      label: "Home",
      href: "/",
    },
    {
      icon: <TrendingUp size="2rem" strokeWidth={1} />,
      label: "Trending",
      href: "/trending",
    },
    {
      icon: <Settings size="2rem" strokeWidth={1} />,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: <Home size="2rem" strokeWidth={1} />,
      label: "Profile",
      href: `/user/${session.data?.user.username}`,
    },
    {
      icon: <ServerCog size="2rem" strokeWidth={1} />,
      label: "Admin panel",
      href: "/admin/reports",
    },
  ];

  const loggedLinks = [
    {
      icon: <Home size="2rem" strokeWidth={1} />,
      label: "Home",
      href: "/",
    },
    {
      icon: <TrendingUp size="2rem" strokeWidth={1} />,
      label: "Trending",
      href: "/trending",
    },
    {
      icon: <Settings size="2rem" strokeWidth={1} />,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: <Home size="2rem" strokeWidth={1} />,
      label: "Profile",
      href: `/user/${session.data?.user.username}`,
    },
  ];

  const notLoggedLinks = [
    {
      icon: <Home size="2rem" strokeWidth={1} />,
      label: "Home",
      href: "/",
    },
    {
      icon: <TrendingUp size="2rem" strokeWidth={1} />,
      label: "Trending",
      href: "/trending",
    },
  ];

  if (
    session.data?.user.role === "ADMIN" &&
    router.pathname.split("/")[1] === "admin"
  ) {
    return (
      <>
        {adminPanelLinks.map((link) => (
          <MainLink {...link} key={link.label} />
        ))}
      </>
    );
  }

  if (session.data?.user.role === "ADMIN") {
    return (
      <>
        {adminLinks.map((link) => (
          <MainLink {...link} key={link.label} />
        ))}
      </>
    );
  }

  if (session.data?.user.role === "USER") {
    return (
      <>
        {loggedLinks.map((link) => (
          <MainLink {...link} key={link.label} />
        ))}
      </>
    );
  }

  return (
    <>
      {notLoggedLinks.map((link) => (
        <MainLink {...link} key={link.label} />
      ))}
    </>
  );
}

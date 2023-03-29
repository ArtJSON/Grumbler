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
import Image from "next/image";

interface MainLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function MainLink({ icon, label, href, active }: MainLinkProps) {
  return (
    <NavLink
      component={Link}
      label={
        <Group>
          {icon}
          <Text size="lg">{label}</Text>
        </Group>
      }
      active={active}
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

  let links: MainLinkProps[] = [];

  if (
    session.data?.user.role === "ADMIN" &&
    router.pathname.split("/")[1] === "admin"
  ) {
    links = [
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
  } else if (session.data?.user.role === "ADMIN") {
    links = [
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
        icon: (
          <Image
            alt="User image"
            src={session.data.user.image ?? "/defaultUserImage.webp"}
            width={32}
            height={32}
            style={{
              borderRadius: 4,
            }}
          />
        ),
        label: "Profile",
        href: `/user/${session.data?.user.username}`,
      },
      {
        icon: <ServerCog size="2rem" strokeWidth={1} />,
        label: "Admin panel",
        href: "/admin/reports",
      },
    ];
  } else if (session.data?.user.role === "USER") {
    links = [
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
        icon: (
          <Image
            alt="User image"
            src={session.data.user.image ?? "/defaultUserImage.webp"}
            width={32}
            height={32}
            style={{
              borderRadius: 4,
            }}
          />
        ),
        label: "Profile",
        href: `/user/${session.data?.user.username}`,
      },
    ];
  } else {
    links = [
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
  }

  return (
    <>
      {links.map((link) => (
        <MainLink
          {...link}
          key={link.label}
          active={router.asPath === link.href}
        />
      ))}
    </>
  );
}

import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { errorMessages } from "../utils/errorMessages";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (
      session.status === "authenticated" &&
      router.pathname !== "/settings" &&
      (!Boolean(session.data?.user.username) ||
        !Boolean(session.data?.user.displayName))
    ) {
      notifications.show({
        message: "Set username and display name to continue",
      });
      router.push("/settings");
    }

    if (
      router.pathname.split("/")[1] === "admin" &&
      session.data?.user.role !== "ADMIN"
    ) {
      notifications.show({
        message: errorMessages.FORBIDDEN,
        color: "red",
      });
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, router.pathname]);

  return <>{children}</>;
}

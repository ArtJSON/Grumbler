import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();
  const [authorized, setAuthorized] = useState(false);

  console.log(session.data?.user);

  useEffect(() => {
    if (
      session.status === "authenticated" &&
      router.pathname !== "/settings" &&
      (!Boolean(session.data?.user.username) ||
        !Boolean(session.data?.user.displayName))
    ) {
      router.push("/settings");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, router.pathname]);

  return <>{children}</>;
}

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowBack,
  BellRinging,
  Brightness,
  Files,
  Flag,
  Home2,
  Login,
  ServerBolt,
  Settings,
  TrendingUp,
  User,
  Users,
} from "tabler-icons-react";
import { useThemeContext } from "../ThemeManager/ThemeManager";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  inAdminPanel: boolean;
}

export function Sidebar({ inAdminPanel }: SidebarProps) {
  const { data: sessionData } = useSession();
  const theme = useThemeContext();

  return (
    <nav
      className={`${styles.sidebar} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
      <ul className={styles.optionList}>
        {inAdminPanel ? (
          <>
            <Link className={`${styles.option}`} href="/">
              <ArrowBack size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Main application</span>
            </Link>
            <Link
              className={`${styles.option} ${styles.desktopOnly}`}
              href="/admin/reports"
            >
              <Flag size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Resolve reports</span>
            </Link>
            <Link
              className={`${styles.option} ${styles.desktopOnly}`}
              href="/admin/users"
            >
              <Users size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Manage users</span>
            </Link>
            <Link
              className={`${styles.option} ${styles.desktopOnly}`}
              href="/admin/posts"
            >
              <Files size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Manage posts</span>
            </Link>
            <div
              className={`${styles.option} ${styles.desktopOnly}`}
              onClick={() => theme.toggleTheme()}
            >
              <Brightness size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>{theme.theme} mode</span>
            </div>
          </>
        ) : (
          <>
            <Link className={styles.option} href="/">
              <Home2 size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Home</span>
            </Link>
            <Link className={styles.option} href="/trending">
              <TrendingUp size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Trending</span>
            </Link>
            <Link className={styles.option} href="#">
              <BellRinging size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>Notifications</span>
            </Link>
            {sessionData ? (
              <>
                <Link
                  className={`${styles.option} ${styles.desktopOnly}`}
                  href="/settings"
                >
                  <Settings size={32} strokeWidth={2} color={"black"} />
                  <span className={styles.optionText}>Settings</span>
                </Link>
                <Link
                  className={styles.option}
                  href={`/user/${sessionData.user.username}`}
                >
                  {sessionData.user.image ? (
                    <Image
                      src={sessionData.user.image}
                      alt="User picture"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <User size={32} strokeWidth={2} color={"black"} />
                  )}
                  <span className={styles.optionText}>Profile</span>
                </Link>
              </>
            ) : (
              <div
                className={styles.option}
                onClick={() => {
                  void (async () => {
                    await signIn();
                  })();
                }}
              >
                <Login size={32} strokeWidth={2} color={"black"} />
                <span className={styles.optionText}>Sign in</span>
              </div>
            )}
            {sessionData && sessionData.user.role === "ADMIN" && (
              <Link
                className={`${styles.option} ${styles.desktopOnly}`}
                href="/admin/reports"
              >
                <ServerBolt size={32} strokeWidth={2} color={"black"} />
                <span className={styles.optionText}>Admin panel</span>
              </Link>
            )}
            {sessionData && (
              <div
                className={`${styles.option} ${styles.desktopOnly}`}
                onClick={() => {
                  signOut({
                    callbackUrl: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout`,
                  });
                }}
              >
                <Login size={32} strokeWidth={2} color={"black"} />
                <span className={styles.optionText}>Sign out</span>
              </div>
            )}
            <div
              className={`${styles.option} ${styles.desktopOnly}`}
              onClick={() => theme.toggleTheme()}
            >
              <Brightness size={32} strokeWidth={2} color={"black"} />
              <span className={styles.optionText}>{theme.theme} mode</span>
            </div>
          </>
        )}
      </ul>
    </nav>
  );
}

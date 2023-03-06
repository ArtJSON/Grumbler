import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  BellRinging,
  Home2,
  Login,
  ServerBolt,
  Settings,
  TrendingUp,
  User,
} from "tabler-icons-react";
import styles from "./Sidebar.module.scss";

export function Sidebar() {
  const { data: sessionData } = useSession();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.optionList}>
        <Link className={styles.option} href="/">
          <Home2 size={32} strokeWidth={2} color={"black"} />
          <span className={styles.optionText}>Home</span>
        </Link>
        <Link className={styles.option} href="#">
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
          <Link className={`${styles.option} ${styles.desktopOnly}`} href="#">
            <ServerBolt size={32} strokeWidth={2} color={"black"} />
            <span className={styles.optionText}>Admin panel</span>
          </Link>
        )}
        {sessionData && (
          <div
            className={styles.option}
            onClick={() => {
              void (async () => {
                await signOut();
              })();
            }}
          >
            <Login size={32} strokeWidth={2} color={"black"} />
            <span className={styles.optionText}>Sign out</span>
          </div>
        )}
      </ul>
    </nav>
  );
}

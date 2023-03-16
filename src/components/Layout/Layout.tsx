import { useRouter } from "next/router";
import { Sidebar } from "../Sidebar/Sidebar";
import { useThemeContext } from "../ThemeManager/ThemeManager";
import styles from "./Layout.module.scss";

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useThemeContext();
  const router = useRouter();

  return (
    <div
      className={`${styles.layout} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
      <Sidebar inAdminPanel={router.pathname.split("/")[1] === "admin"} />
      <div className={styles.pageWrapper}>
        {router.pathname.split("/")[1] === "admin" ? (
          <>{children}</>
        ) : (
          <div className={styles.childrenContainer}>{children}</div>
        )}
      </div>
    </div>
  );
}

import { Sidebar } from "../Sidebar/Sidebar";
import { useThemeContext } from "../ThemeManager/ThemeManager";
import styles from "./Layout.module.scss";

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useThemeContext();

  return (
    <div
      className={`${styles.layout} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
      <Sidebar />
      <div className={styles.pageWrapper}>
        <div className={styles.childrenContainer}>{children}</div>
      </div>
    </div>
  );
}

import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./Layout.module.scss";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      {children}
    </div>
  );
}

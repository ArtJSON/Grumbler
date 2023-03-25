import { Loader as MantineLoader } from "@mantine/core";
import styles from "./Loader.module.scss";

export function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <MantineLoader />
    </div>
  );
}

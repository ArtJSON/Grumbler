import Image from "next/image";
import Link from "next/link";
import styles from "./PostInfoHeader.module.scss";

interface PostInfoHeaderProps {
  imageUrl: string;
  displayName: string;
  username: string;
  createdAt: string;
}

export function PostInfoHeader({
  imageUrl,
  displayName,
  username,
  createdAt,
}: PostInfoHeaderProps) {
  return (
    <div className={styles.postInfoHeader}>
      <Link href={`/user/${username}`} className={styles.userInfo}>
        <Image src={imageUrl} alt="User image" width={32} height={32} />
        <div className={styles.namesContainer}>
          <span className={styles.displayName}>{displayName}</span>
          <span className={styles.username}>@{username}</span>
        </div>
      </Link>
      <div className={styles.date}>{createdAt}</div>
    </div>
  );
}

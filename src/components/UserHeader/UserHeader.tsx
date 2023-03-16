import Image from "next/image";
import Link from "next/link";
import { Settings } from "tabler-icons-react";
import styles from "./UserHeader.module.scss";

interface UserHeaderProps {
  username: string;
  imageUrl: string;
  displayName: string;
  bio?: string;
  joinedAt: string;
  followers: number;
  following: number;
  isUserFollowing: boolean;
  onFollowClick: () => void;
  posts: number;
  isUserOwner: boolean;
}

export function UserHeader({
  username,
  imageUrl,
  displayName,
  bio,
  joinedAt,
  followers,
  following,
  posts,
  onFollowClick,
  isUserFollowing,
  isUserOwner,
}: UserHeaderProps) {
  return (
    <div className={styles.userHeader}>
      <div className={styles.infoImageContainer}>
        <div className={styles.userInfo}>
          <span className={styles.displayName}>{displayName}</span>
          <span className={styles.username}>{username}</span>
          <span className={styles.joinedAt}>Since {joinedAt}</span>
          {isUserOwner ? (
            <Link
              className={`${styles.option} ${styles.desktopOnly}`}
              href="/settings"
            >
              <Settings size={32} strokeWidth={2} color={"black"} />
              <span>Settings</span>
            </Link>
          ) : (
            <button className={styles.followButton} onClick={onFollowClick}>
              {isUserFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <Image
          width={96}
          height={96}
          src={imageUrl}
          alt="User image"
          className={styles.image}
        />
      </div>
      {bio && <div className={styles.bio}>{bio}</div>}
      <div className={styles.followerInfo}>
        <span className={styles.followers}>{followers} followers</span>
        <span className={styles.following}>{following} following</span>
        <span className={styles.posts}>{posts} posts</span>
      </div>
    </div>
  );
}

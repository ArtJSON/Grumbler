import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightCircle,
  Eye,
  Heart,
  MessageCircle,
  User,
} from "tabler-icons-react";
import styles from "./Post.module.scss";

interface PostProps {
  id: string;
  createdAt: string;
  userId: string;
  userImage?: string;
  displayName: string;
  username: string;
  content: string;
  commentCount: number;
  likesCount: number;
  forwardCount: number;
  viewCount: number;
  hasExtendedContent: boolean;
}

export function Post({
  id,
  createdAt,
  userImage,
  displayName,
  username,
  content,
  commentCount,
  likesCount,
  forwardCount,
  viewCount,
  hasExtendedContent,
}: PostProps) {
  return (
    <Link href={`/post/${id}`} className={styles.post}>
      <div className={styles.infoHeader}>
        <div className={styles.userInfo}>
          {userImage ? (
            <Image src={userImage} alt="User image" width={32} height={32} />
          ) : (
            <User size={32} strokeWidth={2} color={"black"} />
          )}
          <div className={styles.namesContainer}>
            <span className={styles.displayName}>{displayName}</span>
            <span className={styles.username}>@{username}</span>
          </div>
        </div>
        <div className={styles.date}>{createdAt}</div>
      </div>
      <div className={styles.content}>{content}</div>
      {hasExtendedContent && (
        <div className={styles.readMore}>Click to read more...</div>
      )}
      <div className={styles.infoFooter}>
        <span>
          {likesCount}
          <Heart />
        </span>
        <span>
          {commentCount}
          <MessageCircle />
        </span>
        <span>
          {forwardCount}
          <ArrowUpRightCircle />
        </span>
        <span>
          {viewCount}
          <Eye />
        </span>
      </div>
    </Link>
  );
}

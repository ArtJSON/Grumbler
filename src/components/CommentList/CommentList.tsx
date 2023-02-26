import Image from "next/image";
import { Heart } from "tabler-icons-react";
import { PostInfoHeader } from "../Post/PostFragments/PostInfoHeader/PostInfoHeader";
import styles from "./CommentList.module.scss";

interface CommentListProps {
  comments: {
    commentId: string;
    text: string;
    createdAt: string;
    userId: string;
    displayName: string;
    username: string;
    userImgUrl: string;
  }[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className={styles.commentList}>
      {comments.map((c) => (
        <div className={styles.comment} key={c.commentId}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <Image
                src={c.userImgUrl}
                alt="User image"
                width={32}
                height={32}
              />
              <div className={styles.namesContainer}>
                <span className={styles.displayName}>{c.displayName}</span>
                <span className={styles.username}>@{c.username}</span>
              </div>
            </div>
            <div className={styles.dateLikeContainer}>
              <div className={styles.date}>{c.createdAt}</div>
              <div className={styles.like}>
                {0}
                <Heart />
              </div>
            </div>
          </div>
          {c.text}
        </div>
      ))}
    </div>
  );
}

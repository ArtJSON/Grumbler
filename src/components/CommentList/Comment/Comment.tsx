import Image from "next/image";
import { useState } from "react";
import { Heart } from "tabler-icons-react";
import { api } from "../../../utils/api";
import { useThemeContext } from "../../ThemeManager/ThemeManager";
import styles from "./Comment.module.scss";

interface CommentProps {
  userImgUrl: string;
  text: string;
  commentId: string;
  username: string;
  displayName: string;
  createdAt: string;
  liked: boolean;
  likeAmount: number;
}

export function Comment({
  userImgUrl,
  text,
  username,
  displayName,
  createdAt,
  liked,
  commentId,
  likeAmount,
}: CommentProps) {
  const likeCommentMutation = api.comment.likeComment.useMutation();
  const unlikeCommentMutation = api.comment.unlikeComment.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const theme = useThemeContext();

  return (
    <div
      className={`${styles.comment} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Image src={userImgUrl} alt="User image" width={32} height={32} />
          <div className={styles.namesContainer}>
            <span className={styles.displayName}>{displayName}</span>
            <span className={styles.username}>@{username}</span>
          </div>
        </div>
        <div className={styles.dateLikeContainer}>
          <div className={styles.date}>{createdAt}</div>
          <div
            className={`${styles.like} ${isLiked ? styles.liked : ""}`}
            onClick={() => {
              if (isLiked) {
                unlikeCommentMutation.mutate({ commentId: commentId });
              } else {
                likeCommentMutation.mutate({ commentId: commentId });
              }
              setIsLiked((prev) => !prev);
            }}
          >
            {likeAmount - Number(liked) + Number(isLiked)}
            <Heart />
          </div>
        </div>
      </div>
      <span className={styles.content}>{text}</span>
    </div>
  );
}

import { Flag, Heart, MessageCircle } from "tabler-icons-react";
import { useThemeContext } from "../../../ThemeManager/ThemeManager";
import styles from "./PostReactionsFooter.module.scss";

interface PostReactionsFooterProps {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onLikeClick: () => void;
  onReportClick: () => void;
}

export function PostReactionsFooter({
  likesCount,
  commentsCount,
  liked,
  onLikeClick,
  onReportClick,
}: PostReactionsFooterProps) {
  const theme = useThemeContext();

  return (
    <div
      className={`${styles.postReactionsFooter} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.reactionContainer}>
        <span
          className={`${styles.item} ${liked ? styles.liked : ""}`}
          onClick={(e) => {
            e.preventDefault();
            onLikeClick();
          }}
        >
          {likesCount}
          <Heart />
        </span>
        <span className={styles.item}>
          {commentsCount}
          <MessageCircle />
        </span>
      </div>
      <span
        className={styles.item}
        onClick={(e) => {
          e.preventDefault();
          onReportClick();
        }}
      >
        <Flag />
      </span>
    </div>
  );
}

import { useState } from "react";
import {
  ArrowUpRightCircle,
  Eye,
  Flag,
  Heart,
  MessageCircle,
} from "tabler-icons-react";
import { useThemeContext } from "../../../ThemeManager/ThemeManager";
import styles from "./PostReactionsFooter.module.scss";

interface PostReactionsFooterProps {
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  liked: boolean;
  onLikeClick: () => void;
  onReportClick: () => void;
}

export function PostReactionsFooter({
  likesCount,
  commentsCount,
  viewsCount,
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

import { useState } from "react";
import {
  ArrowUpRightCircle,
  Eye,
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
}

export function PostReactionsFooter({
  likesCount,
  commentsCount,
  viewsCount,
  liked,
  onLikeClick,
}: PostReactionsFooterProps) {
  const theme = useThemeContext();

  return (
    <div
      className={`${styles.postReactionsFooter} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
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
      <span className={styles.item}>
        {viewsCount}
        <Eye />
      </span>
    </div>
  );
}

import { useState } from "react";
import {
  ArrowUpRightCircle,
  Eye,
  Heart,
  MessageCircle,
} from "tabler-icons-react";
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
  return (
    <div className={styles.postReactionsFooter}>
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

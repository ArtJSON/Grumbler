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
  forwardsCount: number;
  viewsCount: number;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onForwardClick: () => void;
}

export function PostReactionsFooter({
  likesCount,
  commentsCount,
  forwardsCount,
  viewsCount,
}: PostReactionsFooterProps) {
  return (
    <div className={styles.postReactionsFooter}>
      <span>
        {likesCount}
        <Heart />
      </span>
      <span>
        {commentsCount}
        <MessageCircle />
      </span>
      <span>
        {forwardsCount}
        <ArrowUpRightCircle />
      </span>
      <span>
        {viewsCount}
        <Eye />
      </span>
    </div>
  );
}

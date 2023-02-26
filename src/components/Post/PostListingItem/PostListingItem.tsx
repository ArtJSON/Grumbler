import Link from "next/link";
import styles from "./PostListingItem.module.scss";
import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../PostFragments/PostReactionsFooter/PostReactionsFooter";

interface PostListingItemProps {
  id: string;
  createdAt: string;
  userId: string;
  userImage?: string;
  displayName: string;
  username: string;
  content: string;
  commentsCount: number;
  likesCount: number;
  forwardsCount: number;
  viewsCount: number;
  hasExtendedContent: boolean;
}

export function PostListingItem({
  id,
  createdAt,
  userImage,
  displayName,
  username,
  content,
  commentsCount,
  likesCount,
  forwardsCount,
  viewsCount,
  hasExtendedContent,
}: PostListingItemProps) {
  return (
    <Link href={`/post/${id}`} className={styles.post}>
      <PostInfoHeader
        imageUrl={userImage ?? "/defaultUserImage.webp"}
        displayName={displayName}
        username={username}
        createdAt={createdAt}
      />
      <div className={styles.content}>{content}</div>
      {hasExtendedContent && (
        <div className={styles.readMore}>Click to read more...</div>
      )}
      <PostReactionsFooter
        likesCount={likesCount}
        commentsCount={commentsCount}
        forwardsCount={forwardsCount}
        viewsCount={viewsCount}
        onLikeClick={function (): void {
          throw new Error("Function not implemented.");
        }}
        onCommentClick={function (): void {
          throw new Error("Function not implemented.");
        }}
        onForwardClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Link>
  );
}

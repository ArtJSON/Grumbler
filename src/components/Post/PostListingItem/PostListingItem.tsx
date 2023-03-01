import Link from "next/link";
import styles from "./PostListingItem.module.scss";
import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../PostFragments/PostReactionsFooter/PostReactionsFooter";
import { api } from "../../../utils/api";
import { useState } from "react";

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
  liked: boolean;
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
  liked,
}: PostListingItemProps) {
  const likePostMutation = api.post.like.useMutation();
  const unlikePostMutation = api.post.unlike.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(liked);

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
        likesCount={likesCount - Number(liked) + Number(isLiked)}
        commentsCount={commentsCount}
        forwardsCount={forwardsCount}
        viewsCount={viewsCount}
        liked={isLiked}
        onLikeClick={() => {
          if (isLiked) {
            unlikePostMutation.mutate({ postId: id });
          } else {
            likePostMutation.mutate({ postId: id });
          }
          setIsLiked((prev) => !prev);
        }}
        onForwardClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Link>
  );
}

import Link from "next/link";
import styles from "./PostListingItem.module.scss";
import { PostInfoHeader } from "../../Post/PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../../Post/PostFragments/PostReactionsFooter/PostReactionsFooter";
import { api } from "../../../utils/api";
import { useState } from "react";

export interface PostListingItemProps {
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
  likeButtonActive: boolean;
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
  likeButtonActive,
}: PostListingItemProps) {
  const likePostMutation = api.post.like.useMutation();
  const unlikePostMutation = api.post.unlike.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(liked);

  return (
    <div className={styles.post}>
      <PostInfoHeader
        imageUrl={userImage ?? "/defaultUserImage.webp"}
        displayName={displayName}
        username={username}
        createdAt={createdAt}
      />
      <Link href={`/post/${id}`} className={styles.content}>
        <div>{content}</div>
        {hasExtendedContent && (
          <div className={styles.readMore}>Click to read more...</div>
        )}
      </Link>
      <PostReactionsFooter
        likesCount={likesCount - Number(liked) + Number(isLiked)}
        commentsCount={commentsCount}
        forwardsCount={forwardsCount}
        viewsCount={viewsCount}
        liked={isLiked}
        onLikeClick={() => {
          if (!likeButtonActive) {
            return;
          }

          if (isLiked) {
            unlikePostMutation.mutate({ postId: id });
          } else {
            likePostMutation.mutate({ postId: id });
          }

          setIsLiked((prev) => !prev);
        }}
        onForwardClick={() => {}}
      />
    </div>
  );
}

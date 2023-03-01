import Image from "next/image";
import { Heart } from "tabler-icons-react";
import { api } from "../../utils/api";
import { PostInfoHeader } from "../Post/PostFragments/PostInfoHeader/PostInfoHeader";
import { Comment } from "./Comment/Comment";
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
    liked: boolean;
    likeAmount: number;
  }[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className={styles.commentList}>
      {comments.map(
        ({
          username,
          displayName,
          liked,
          userImgUrl,
          createdAt,
          text,
          commentId,
          likeAmount,
        }) => (
          <Comment
            userImgUrl={userImgUrl}
            text={text}
            username={username}
            displayName={displayName}
            createdAt={createdAt}
            liked={liked}
            commentId={commentId}
            likeAmount={likeAmount}
            key={commentId}
          />
        )
      )}
    </div>
  );
}

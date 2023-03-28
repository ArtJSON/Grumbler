import { Stack } from "@mantine/core";
import { Comment } from "./Comment/Comment";

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
    <Stack>
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
    </Stack>
  );
}

import { GetServerSideProps } from "next";
import { useState } from "react";
import { CommentInput } from "../../components/CommentInput/CommentInput";
import { CommentList } from "../../components/CommentList/CommentList";
import { PostDetailed } from "../../components/Post/PostDetailed/PostDetailed";
import { api } from "../../utils/api";
import styles from "./PostPage.module.scss";

interface PostPagePropsType {
  postId: string;
}

export default function PostPage({ postId }: PostPagePropsType) {
  const { data: postData, refetch } = api.post.getById.useQuery(
    { id: postId },
    {
      onSuccess(data) {
        setIsLiked(data.post.liked);
      },
    }
  );
  const likePostMutation = api.post.like.useMutation();
  const unlikePostMutation = api.post.unlike.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  if (!postData) {
    return;
  }

  return (
    <div className={styles.postPage}>
      <div className={styles.postInfo}>
        <PostDetailed
          {...postData.post}
          onLikeClick={function (): void {
            if (!postData.post.likeButtonActive) {
              return;
            }

            if (isLiked) {
              unlikePostMutation.mutate({ postId: postId });
            } else {
              likePostMutation.mutate({ postId: postId });
            }

            setIsLiked((prev) => !prev);
          }}
          likesCount={
            postData.post.likesCount -
            Number(postData.post.liked) +
            Number(isLiked)
          }
          liked={isLiked}
        />
        <CommentInput postId={postId} onSubmit={refetch} />
      </div>
      {postData.comments && <CommentList comments={postData.comments} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    postId: query.postId,
  },
});

import { Stack } from "@mantine/core";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { CommentInput } from "../../components/CommentInput/CommentInput";
import { CommentList } from "../../components/CommentList/CommentList";
import { Loader } from "../../components/Loader/Loader";
import { PostDetailed } from "../../components/Post/PostDetailed/PostDetailed";
import { api } from "../../utils/api";

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
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | {postData.post.displayName}&apos;s post</title>
      </Head>
      <Stack spacing={48}>
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
        {postData.comments && <CommentList comments={postData.comments} />}
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    postId: query.postId,
  },
});

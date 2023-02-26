import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { CommentInput } from "../../components/CommentInput/CommentInput";
import { PostDetailed } from "../../components/Post/PostDetailed/PostDetailed";
import { PostReactionsFooter } from "../../components/Post/PostFragments/PostReactionsFooter/PostReactionsFooter";
import { api } from "../../utils/api";
import styles from "./PostPage.module.scss";

interface PostPagePropsType {
  postId: string;
}

export default function PostPage({ postId }: PostPagePropsType) {
  const { data: postData, refetch } = api.post.getById.useQuery({ id: postId });

  return (
    <div className={styles.postPage}>
      <PostDetailed
        imageUrl={postData?.user.avatar ?? "/defaultUserImage.webp"}
        displayName={postData?.user.displayName ?? ""}
        username={postData?.user.name ?? ""}
        createdAt={postData?.createdAt.toDateString() ?? ""}
        content={postData?.content ?? ""}
        extendedContent={postData?.extendedContent ?? undefined}
      />
      <PostReactionsFooter
        likesCount={postData?._count.postLikes ?? 0}
        commentsCount={postData?._count.comments ?? 0}
        forwardsCount={postData?._count.forwards ?? 0}
        viewsCount={postData?.views ?? 0}
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
      <CommentInput postId={postId} onSubmit={refetch} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    postId: query.postId,
  },
});
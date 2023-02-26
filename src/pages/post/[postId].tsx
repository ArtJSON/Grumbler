import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { PostDetailed } from "../../components/Post/PostDetailed/PostDetailed";
import { api } from "../../utils/api";
import styles from "./PostPage.module.scss";

interface PostPagePropsType {
  postId: string;
}

export default function PostPage({ postId }: PostPagePropsType) {
  const { data: postData } = api.post.getById.useQuery({ id: postId });

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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    postId: query.postId,
  },
});

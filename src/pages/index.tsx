import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { PostInput } from "../components/PostInput";
import InfiniteScrollTrigger from "../components/InfiniteScrollTrigger";
import { Loader } from "../components/Loader";
import { Stack } from "@mantine/core";
import { PostList } from "../components/Post";

const Home: NextPage = () => {
  const {
    data: postsData,
    refetch,
    fetchNextPage,
    isFetching,
  } = api.post.getRecent.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const postCreateMutation = api.post.create.useMutation();

  if (!postsData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler</title>
      </Head>
      <Stack spacing={48}>
        <PostInput
          onSubmit={async (content, extendedContent) => {
            await postCreateMutation.mutateAsync({
              content: content,
              extendedConent: extendedContent,
            });
            refetch();
          }}
        />
        <PostList
          refetch={refetch}
          posts={postsData.pages.map((p) => p.posts).flat(1)}
        />
      </Stack>
      <InfiniteScrollTrigger
        isFetching={isFetching}
        onScreenEnter={fetchNextPage}
      />
    </>
  );
};

export default Home;

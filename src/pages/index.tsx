import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { PostInput } from "../components/PostInput/PostInput";
import { PostList } from "../components/PostList/PostList";
import InfiniteScrollTrigger from "../components/InfiniteScrollTrigger/InfiniteScrollTrigger";
import { Loader } from "../components/Loader/Loader";
import { Stack } from "@mantine/core";

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
          onSubmit={() => {
            refetch();
          }}
        />
        <PostList posts={postsData.pages.map((p) => p.posts).flat(1)} />
      </Stack>
      {!isFetching && <InfiniteScrollTrigger onScreenEnter={fetchNextPage} />}
    </>
  );
};

export default Home;

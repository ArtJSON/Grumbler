import Head from "next/head";
import { api } from "../../utils/api";
import { PostList } from "../../components/PostList/PostList";
import { Loader } from "../../components/Loader/Loader";
import InfiniteScrollTrigger from "../../components/InfiniteScrollTrigger/InfiniteScrollTrigger";
import { Stack } from "@mantine/core";

export default function TrendingPage() {
  const {
    data: trendingData,
    fetchNextPage,
    isFetching,
  } = api.post.getTrending.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!trendingData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | Trending</title>
      </Head>
      <Stack spacing={48}>
        <PostList posts={trendingData.pages.map((p) => p.posts).flat(1)} />
      </Stack>
      {!isFetching && (
        <InfiniteScrollTrigger
          isFetching={isFetching}
          onScreenEnter={fetchNextPage}
        />
      )}
    </>
  );
}

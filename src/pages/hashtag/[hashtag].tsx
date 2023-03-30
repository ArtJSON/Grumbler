import { Anchor, Stack, Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import InfiniteScrollTrigger from "../../components/InfiniteScrollTrigger/InfiniteScrollTrigger";
import { Loader } from "../../components/Loader/Loader";
import { PostList } from "../../components/PostList/PostList";
import { api } from "../../utils/api";

interface HashtagPagePropsType {
  hashtag: string;
}

export default function HashtagPage({ hashtag }: HashtagPagePropsType) {
  const {
    data: trendingData,
    fetchNextPage,
    isFetching,
  } = api.post.getByHashtag.useInfiniteQuery(
    { hashtagName: hashtag },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  if (!trendingData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | #{hashtag}</title>
      </Head>
      <Stack spacing={48}>
        <HashtagInfo
          hashtagName={hashtag}
          postsAllTime={100}
          postsRecently={13}
        />
        <PostList posts={trendingData.pages.map((p) => p.posts).flat(1)} />
      </Stack>
      <InfiniteScrollTrigger
        isFetching={isFetching}
        onScreenEnter={fetchNextPage}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    hashtag: query.hashtag,
  },
});

interface HashtagInfoProps {
  hashtagName: string;
  postsRecently: number;
  postsAllTime: number;
}

function HashtagInfo({
  hashtagName,
  postsAllTime,
  postsRecently,
}: HashtagInfoProps) {
  return (
    <Stack
      sx={(t) => ({
        backgroundColor: t.colorScheme === "dark" ? t.colors.dark[6] : t.white,
        borderRadius: t.radius.sm,
        border: `0.0625rem solid ${
          t.colorScheme === "dark" ? t.colors.dark[4] : t.colors.gray[4]
        }`,
      })}
      spacing="sm"
    >
      <Text size="xl" p={16}>
        Top posts in{" "}
        <Anchor
          component="span"
          sx={{ cursor: "auto", ":hover": { textDecoration: "none" } }}
        >
          #{hashtagName}
        </Anchor>
      </Text>
    </Stack>
  );
}

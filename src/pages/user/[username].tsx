import styles from "./UserPage.module.scss";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { api } from "../../utils/api";
import { PostList } from "../../components/PostList/PostList";
import { UserHeader } from "../../components/UserHeader/UserHeader";
import { Loader } from "../../components/Loader/Loader";
import { Stack } from "@mantine/core";
import InfiniteScrollTrigger from "../../components/InfiniteScrollTrigger/InfiniteScrollTrigger";

interface UserPagePropsType {
  username: string;
}

export default function UserPage({ username }: UserPagePropsType) {
  const {
    data: userData,
    refetch,
    isFetching,
    fetchNextPage,
  } = api.user.getUser.useInfiniteQuery(
    {
      username,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const followMutation = api.user.follow.useMutation();
  const unfollowMutation = api.user.unfollow.useMutation();

  if (!userData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | {userData.pages[0]?.user.displayName}</title>
      </Head>
      <Stack spacing={48}>
        <UserHeader
          {...userData.pages[0]!.user}
          onFollowClick={() => {
            if (userData.pages[0]?.user.isUserFollowing) {
              unfollowMutation.mutate({ username });
            } else {
              followMutation.mutate({ username });
            }

            refetch();
          }}
        />
        <PostList posts={userData.pages.map((p) => p.posts).flat(1)} />
      </Stack>
      {!isFetching && <InfiniteScrollTrigger onScreenEnter={fetchNextPage} />}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    username: query.username,
  },
});

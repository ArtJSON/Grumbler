import styles from "./UserPage.module.scss";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { api } from "../../utils/api";
import { PostList } from "../../components/PostList/PostList";
import { UserHeader } from "../../components/UserHeader/UserHeader";
import { Loader } from "../../components/Loader/Loader";

interface UserPagePropsType {
  username: string;
}

export default function UserPage({ username }: UserPagePropsType) {
  const { data: userData, refetch } = api.user.getUser.useQuery({
    page: 0,
    username,
  });

  const followMutation = api.user.follow.useMutation();
  const unfollowMutation = api.user.unfollow.useMutation();

  if (!userData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | {userData.user.displayName}</title>
      </Head>
      <div className={styles.userPage}>
        <UserHeader
          {...userData.user}
          onFollowClick={() => {
            if (userData.user.isUserFollowing) {
              unfollowMutation.mutate({ username });
            } else {
              followMutation.mutate({ username });
            }

            refetch();
          }}
        />
        <PostList posts={userData.posts} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    username: query.username,
  },
});

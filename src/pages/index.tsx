import styles from "./index.module.scss";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { PostInput } from "../components/PostInput/PostInput";
import { PostList } from "../components/PostList/PostList";
import InfiniteScrollTrigger from "../components/InfiniteScrollTrigger/InfiniteScrollTrigger";
import { Loader } from "../components/Loader/Loader";

const Home: NextPage = () => {
  const {
    data: postsData,
    refetch,
    fetchNextPage,
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
      <PostInput
        onSubmit={() => {
          refetch();
        }}
      />
      <div className={styles.postsContainer}>
        <PostList posts={postsData.pages.map((p) => p.posts).flat(1)} />
      </div>
      <InfiniteScrollTrigger onScreenEnter={fetchNextPage} />
    </>
  );
};

export default Home;

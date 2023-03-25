import styles from "./TrendingPage.module.scss";
import Head from "next/head";
import { api } from "../../utils/api";
import { PostList } from "../../components/PostList/PostList";
import { Loader } from "../../components/Loader/Loader";

export default function TrendingPage() {
  const { data: trendingData } = api.post.getTrending.useQuery({ page: 0 });

  if (!trendingData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | Trending</title>
      </Head>
      <div className={styles.trendingsPage}>
        <PostList posts={trendingData.posts} />
      </div>
    </>
  );
}

import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Loader } from "../../components/Loader/Loader";

interface HashtagPagePropsType {
  hashtag: string;
}

export default function HashtagPage({ hashtag }: HashtagPagePropsType) {
  return (
    <>
      <Head>
        <title>Grumbler | #{hashtag}</title>
      </Head>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    hashtag: query.hashtag,
  },
});

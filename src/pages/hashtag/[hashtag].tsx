import type { GetServerSideProps } from "next";
import Head from "next/head";

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

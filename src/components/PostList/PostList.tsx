import {
  PostListingItem,
  PostListingItemProps,
} from "./PostListingItem/PostListingItem";
import styles from "./PostList.module.scss";

interface PostListProps {
  posts: PostListingItemProps[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts.map((p) => (
        <PostListingItem key={p.id} {...p} />
      ))}
    </>
  );
}

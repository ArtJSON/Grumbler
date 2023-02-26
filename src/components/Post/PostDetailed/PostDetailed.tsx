import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import styles from "./PostDetailed.module.scss";

interface PostDetailedProps {
  imageUrl: string;
  displayName: string;
  username: string;
  createdAt: string;
  content: string;
  extendedContent?: string;
}

export function PostDetailed({
  imageUrl,
  displayName,
  username,
  createdAt,
  content,
  extendedContent,
}: PostDetailedProps) {
  return (
    <div className={styles.postDetailed}>
      <PostInfoHeader
        imageUrl={imageUrl}
        displayName={displayName}
        username={username}
        createdAt={createdAt}
      />
      <div className={styles.content}>{content}</div>
      {extendedContent && (
        <div
          className={styles.extendedContent}
          dangerouslySetInnerHTML={{ __html: extendedContent }}
        />
      )}
    </div>
  );
}

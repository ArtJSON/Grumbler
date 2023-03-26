import Link from "next/link";

interface ContentProps {
  content: string;
}

export function Content({ content }: ContentProps) {
  const regex = /#[a-zA-Z0-9_]{1,32}/g;
  const splitContent = content.split(regex);
  const hashtags = content
    .match(regex)
    ?.map((hashtag) => hashtag.slice(1).toLowerCase());

  if (!hashtags) {
    return <>{content}</>;
  }

  return (
    <>
      {splitContent.map((frag, idx) => {
        if (idx < hashtags.length) {
          return (
            <>
              {frag}
              <Link href={`/hashtag/${hashtags[idx]}`}>#{hashtags[idx]}</Link>
            </>
          );
        }

        return <>{frag}</>;
      })}
    </>
  );
}

import { Anchor, Text } from "@mantine/core";
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
    return (
      <Text size="lg" component="span" sx={{ overflowWrap: "anywhere" }}>
        {content}
      </Text>
    );
  }

  return (
    <>
      {splitContent.map((frag, idx) => {
        if (idx < hashtags.length) {
          return (
            <>
              <Text
                size="lg"
                component="span"
                sx={{ overflowWrap: "anywhere" }}
              >
                {frag}
              </Text>
              <Anchor
                component={Link}
                href={`/hashtag/${hashtags[idx]}`}
                size="lg"
                style={{ zIndex: 1, position: "relative" }}
              >
                #{hashtags[idx]}
              </Anchor>
            </>
          );
        }

        return <>{frag}</>;
      })}
    </>
  );
}

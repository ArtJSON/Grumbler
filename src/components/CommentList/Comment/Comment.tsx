import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { Heart } from "tabler-icons-react";
import { api } from "../../../utils/api";
import { PostInfoHeader } from "../../Post/PostFragments/PostInfoHeader/PostInfoHeader";

interface CommentProps {
  userImgUrl: string;
  text: string;
  commentId: string;
  username: string;
  displayName: string;
  createdAt: string;
  liked: boolean;
  likeAmount: number;
}

export function Comment({
  userImgUrl,
  text,
  username,
  displayName,
  createdAt,
  liked,
  commentId,
  likeAmount,
}: CommentProps) {
  const likeCommentMutation = api.comment.likeComment.useMutation();
  const unlikeCommentMutation = api.comment.unlikeComment.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const theme = useMantineTheme();

  return (
    <Stack
      sx={(t) => ({
        backgroundColor: t.colorScheme === "dark" ? t.colors.dark[6] : t.white,
        borderRadius: t.radius.sm,
        border: `0.0625rem solid ${
          t.colorScheme === "dark" ? t.colors.dark[4] : t.colors.gray[4]
        }`,
      })}
      p={16}
    >
      <PostInfoHeader
        imageUrl={userImgUrl}
        displayName={displayName}
        username={username}
        createdAt={createdAt}
      />
      <Text size="lg">{text}</Text>
      <Text
        p={0}
        onClick={() => {
          if (isLiked) {
            unlikeCommentMutation.mutate({ commentId: commentId });
          } else {
            likeCommentMutation.mutate({ commentId: commentId });
          }
          setIsLiked((prev) => !prev);
        }}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          zIndex: 1,
        }}
      >
        <Flex justify="flex-start" align="center" gap={4}>
          <Text size="xl">{likeAmount - Number(liked) + Number(isLiked)}</Text>
          <Heart
            style={{
              fill: isLiked ? theme.colors.teal[6] : undefined,
              stroke: isLiked ? theme.colors.teal[6] : undefined,
            }}
          />
        </Flex>
      </Text>
    </Stack>
  );
}

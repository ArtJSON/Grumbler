import { Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { Flag, Heart, MessageCircle } from "tabler-icons-react";

interface PostReactionsFooterProps {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onLikeClick: () => void;
  onReportClick: () => void;
}

export function PostReactionsFooter({
  likesCount,
  commentsCount,
  liked,
  onLikeClick,
  onReportClick,
}: PostReactionsFooterProps) {
  const theme = useMantineTheme();

  return (
    <Flex justify="space-between">
      <Group spacing="lg">
        <Text
          p={0}
          onClick={(e) => {
            e.preventDefault();
            onLikeClick();
          }}
          sx={{
            cursor: "pointer",
            userSelect: "none",
            zIndex: 1,
          }}
        >
          <Flex justify="space-between" align="center" gap={4}>
            <Text size="xl">{likesCount}</Text>
            <Heart
              style={{
                fill: liked ? theme.colors.teal[6] : undefined,
                stroke: liked ? theme.colors.teal[6] : undefined,
              }}
            />
          </Flex>
        </Text>
        <Text
          p={0}
          sx={{
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Flex justify="space-commentsCount" align="center" gap={4}>
            <Text size="xl">{commentsCount}</Text>
            <MessageCircle />
          </Flex>
        </Text>
      </Group>
      <Text
        onClick={(e) => {
          e.preventDefault();
          onReportClick();
        }}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          zIndex: 1,
        }}
      >
        <Flag />
      </Text>
    </Flex>
  );
}

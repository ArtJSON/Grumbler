import { Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { Edit, Flag, Heart, MessageCircle, X } from "tabler-icons-react";

interface PostReactionsFooterProps {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onLikeClick: () => void;
  onReportClick: () => void;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
}

export function PostReactionsFooter({
  likesCount,
  commentsCount,
  liked,
  onLikeClick,
  onReportClick,
  onRemoveClick,
  onEditClick,
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
      <Group>
        {onEditClick && onRemoveClick ? (
          <>
            <Text
              onClick={(e) => {
                e.preventDefault();
                onRemoveClick();
              }}
              sx={{
                cursor: "pointer",
                userSelect: "none",
                zIndex: 1,
              }}
            >
              <X />
            </Text>
            <Text
              onClick={(e) => {
                e.preventDefault();
                onEditClick();
              }}
              sx={{
                cursor: "pointer",
                userSelect: "none",
                zIndex: 1,
              }}
            >
              <Edit />
            </Text>
          </>
        ) : (
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
        )}
      </Group>
    </Flex>
  );
}

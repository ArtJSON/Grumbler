import { Button, Flex, MediaQuery, Stack, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Settings } from "tabler-icons-react";

interface UserHeaderProps {
  username: string;
  imageUrl: string;
  displayName: string;
  bio?: string;
  joinedAt: string;
  followers: number;
  following: number;
  isUserFollowing: boolean;
  onFollowClick: () => void;
  posts: number;
  isUserOwner: boolean;
}

export function UserHeader({
  username,
  imageUrl,
  displayName,
  bio,
  joinedAt,
  followers,
  following,
  posts,
  onFollowClick,
  isUserFollowing,
  isUserOwner,
}: UserHeaderProps) {
  return (
    <Stack
      sx={(t) => ({
        backgroundColor: t.colorScheme === "dark" ? t.colors.dark[6] : t.white,
        borderRadius: t.radius.sm,
        border: `0.0625rem solid ${
          t.colorScheme === "dark" ? t.colors.dark[4] : t.colors.gray[4]
        }`,
        position: "relative",
        overflow: "hidden",
      })}
      spacing="sm"
      p={16}
    >
      <MediaQuery smallerThan="xs" styles={{ flexDirection: "column-reverse" }}>
        <Flex justify="space-between" gap={16}>
          <Stack spacing={16}>
            <Stack spacing={4}>
              <Flex align="center" gap={4}>
                <Text size="xl" inline sx={{ overflowWrap: "anywhere" }}>
                  {displayName}
                </Text>
                {isUserOwner && (
                  <Link href="/settings">
                    <Text sx={{ lineHeight: 0 }}>
                      <Settings size={24} strokeWidth={2} />
                    </Text>
                  </Link>
                )}
              </Flex>
              <Text c="dimmed" sx={{ overflowWrap: "anywhere" }}>
                @{username}
              </Text>
              <Text c="dimmed">Since {joinedAt}</Text>
            </Stack>
            {!isUserOwner && (
              <Button
                sx={{ alignSelf: "flex-start" }}
                onClick={onFollowClick}
                variant={isUserFollowing ? "filled" : "outline"}
              >
                {isUserFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </Stack>
          <Image width={96} height={96} src={imageUrl} alt="User image" />
        </Flex>
      </MediaQuery>
      {bio && <Text size="lg">{bio}</Text>}
      <MediaQuery smallerThan="xs" styles={{ flexDirection: "column", gap: 4 }}>
        <Flex gap={24}>
          <Text c="dimmed">
            Followers: <Text component="span">{followers}</Text>
          </Text>
          <Text c="dimmed">
            Following: <Text component="span">{following}</Text>
          </Text>
          <Text c="dimmed">
            Posts: <Text component="span">{posts}</Text>
          </Text>
        </Flex>
      </MediaQuery>
    </Stack>
  );
}

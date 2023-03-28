import { Flex, Stack, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface PostInfoHeaderProps {
  imageUrl: string;
  displayName: string;
  username: string;
  createdAt: string;
}

export function PostInfoHeader({
  imageUrl,
  displayName,
  username,
  createdAt,
}: PostInfoHeaderProps) {
  return (
    <Flex justify="space-between" align="flex-start" gap="xs">
      <Link href={`/user/${username}`} style={{ zIndex: 1 }}>
        <Flex gap="xs" align="flex-start">
          <Image src={imageUrl} alt="User image" width={36} height={36} />
          <Stack spacing={0}>
            <Text size="xs" sx={{ overflowWrap: "anywhere" }}>
              {displayName}
            </Text>
            <Text color="dark.2" size="xs" sx={{ overflowWrap: "anywhere" }}>
              @{username}
            </Text>
          </Stack>
        </Flex>
      </Link>
      <Text size="xs" align="end">
        {createdAt}
      </Text>
    </Flex>
  );
}

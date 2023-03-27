import { Flex, Stack, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useThemeContext } from "../../../ThemeManager/ThemeManager";

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
  const theme = useThemeContext();

  return (
    <Flex justify="space-between" align="center">
      <Link href={`/user/${username}`} style={{ zIndex: 1 }}>
        <Flex gap="xs" align="center">
          <Image src={imageUrl} alt="User image" width={40} height={40} />
          <Stack spacing={0}>
            <Text size="sm">{displayName}</Text>
            <Text color="dark.2" size="sm">
              @{username}
            </Text>
          </Stack>
        </Flex>
      </Link>
      <Text>{createdAt}</Text>
    </Flex>
  );
}

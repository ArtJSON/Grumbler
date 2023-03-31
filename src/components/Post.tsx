import {
  Flex,
  Group,
  Stack,
  useMantineTheme,
  Anchor,
  Text,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, X, Edit, Flag } from "tabler-icons-react";
import { api } from "../utils/api";
import { EditPostModal } from "./EditPostModal";
import { ReportPostModal } from "./ReportPostModal";
import { Fragment } from "react";
import { useSession } from "next-auth/react";

interface PostListProps {
  posts: Omit<PostListingItemProps, "onReportClick">[];
  refetch: () => void;
}

export function PostList({ posts, refetch }: PostListProps) {
  const [reportedPostId, setReportedPostId] = useState("");
  const [
    reportModalOpened,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);

  const [editPostId, setEditPostId] = useState("");
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const { mutateAsync: deletePostMutation } = api.post.delete.useMutation();

  const { data } = useSession();

  if (posts.length) {
    return (
      <Stack>
        <ReportPostModal
          onClose={() => {
            closeReportModal();
            setReportedPostId("");
            refetch();
          }}
          opened={reportModalOpened}
          postId={reportedPostId}
        />
        <EditPostModal
          onClose={() => {
            closeEditModal();
            setEditPostId("");
            refetch();
          }}
          opened={editModalOpened}
          postId={editPostId}
        />
        {posts.map((p) => (
          <PostListingItem
            key={p.id}
            {...p}
            onReportClick={() => {
              setReportedPostId(p.id);
              openReportModal();
            }}
            onEditClick={
              data?.user.id === p.userId
                ? () => {
                    setEditPostId(p.id);
                    openEditModal();
                  }
                : undefined
            }
            onRemoveClick={
              data?.user.id === p.userId
                ? async () => {
                    await deletePostMutation({ postId: p.id });
                    refetch();
                  }
                : undefined
            }
          />
        ))}
      </Stack>
    );
  } else {
    return <Text align="center">No posts</Text>;
  }
}

interface PostListingItemProps {
  id: string;
  createdAt: string;
  userId: string;
  userImage: string;
  displayName: string;
  username: string;
  content: string;
  commentsCount: number;
  likesCount: number;
  liked: boolean;
  hasExtendedContent: boolean;
  likeButtonActive: boolean;
  onReportClick: () => void;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
}

function PostListingItem({
  id,
  createdAt,
  userImage,
  displayName,
  username,
  content,
  commentsCount,
  likesCount,
  hasExtendedContent,
  liked,
  likeButtonActive,
  onReportClick,
  onEditClick,
  onRemoveClick,
}: PostListingItemProps) {
  const likePostMutation = api.post.like.useMutation();
  const unlikePostMutation = api.post.unlike.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(liked);

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
    >
      <Stack p={16}>
        <PostInfoHeader
          imageUrl={userImage}
          displayName={displayName}
          username={username}
          createdAt={createdAt}
        />
        <Container w="100%" p={0}>
          <Content content={content} />
          {hasExtendedContent && <Text size="xs">Click to read more...</Text>}
        </Container>
        <PostReactionsFooter
          likesCount={likesCount - Number(liked) + Number(isLiked)}
          commentsCount={commentsCount}
          liked={isLiked}
          onLikeClick={() => {
            if (!likeButtonActive) {
              return;
            }

            if (isLiked) {
              unlikePostMutation.mutate({ postId: id });
            } else {
              likePostMutation.mutate({ postId: id });
            }

            setIsLiked((prev) => !prev);
          }}
          onReportClick={onReportClick}
          onEditClick={onEditClick}
          onRemoveClick={onRemoveClick}
        />
      </Stack>
      <Link
        href={`/post/${id}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
    </Stack>
  );
}

interface PostDetailedProps {
  id: string;
  imageUrl: string;
  displayName: string;
  username: string;
  createdAt: string;
  content: string;
  extendedContent?: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onLikeClick: () => void;
}

export function PostDetailed({
  id,
  imageUrl,
  displayName,
  username,
  createdAt,
  content,
  extendedContent,
  likesCount,
  commentsCount,
  liked,
  onLikeClick,
}: PostDetailedProps) {
  const theme = useMantineTheme();
  const editor = useEditor({
    editable: false,
    content: extendedContent,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
  });

  const [
    reportModalOpened,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const { mutateAsync: deletePostMutation } = api.post.delete.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(extendedContent ?? "");
    }
  }, [extendedContent, editor]);

  return (
    <Stack
      sx={(t) => ({
        backgroundColor: t.colorScheme === "dark" ? t.colors.dark[6] : t.white,
        borderRadius: t.radius.sm,
        border: `0.0625rem solid ${
          t.colorScheme === "dark" ? t.colors.dark[4] : t.colors.gray[4]
        }`,
      })}
      spacing="sm"
      p={16}
    >
      <ReportPostModal
        postId={id}
        opened={reportModalOpened}
        onClose={closeReportModal}
      />
      <EditPostModal
        onClose={closeEditModal}
        opened={editModalOpened}
        postId={id}
      />
      <PostInfoHeader
        imageUrl={imageUrl}
        displayName={displayName}
        username={username}
        createdAt={createdAt}
      />
      <Content content={content} />
      {extendedContent && (
        <RichTextEditor
          editor={editor}
          sx={{
            border: "0",
            ".ProseMirror": {
              padding: "0 !important",
              backgroundColor: "transparent !important",
            },
            ".mantine-RichTextEditor-content": {
              backgroundColor: "transparent ",
              maxHeight: "unset !important",
            },
            pre: {
              background: `${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.gray[1]
              } !important`,
            },
          }}
          withCodeHighlightStyles
        >
          <RichTextEditor.Content />
        </RichTextEditor>
      )}
      <PostReactionsFooter
        likesCount={likesCount}
        commentsCount={commentsCount}
        liked={liked}
        onLikeClick={onLikeClick}
        onReportClick={openReportModal}
        onEditClick={openEditModal}
        onRemoveClick={async () => {
          await deletePostMutation({ postId: id });
          router.push("/");
        }}
      />
    </Stack>
  );
}

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
      <Text
        key={content}
        size="lg"
        component="span"
        sx={{ overflowWrap: "anywhere" }}
      >
        {content}
      </Text>
    );
  }

  return (
    <>
      {splitContent.map((frag, idx) => {
        if (idx < hashtags.length) {
          return (
            <Fragment key={idx}>
              <Text
                size="lg"
                component="span"
                sx={{ overflowWrap: "anywhere" }}
                key={idx + frag}
              >
                {frag}
              </Text>
              <Anchor
                component={Link}
                href={`/hashtag/${hashtags[idx]}`}
                size="lg"
                style={{ zIndex: 1, position: "relative" }}
                key={hashtags[idx] ?? "" + idx}
              >
                #{hashtags[idx]}
              </Anchor>
            </Fragment>
          );
        }

        return (
          <Text
            size="lg"
            component="span"
            sx={{ overflowWrap: "anywhere" }}
            key={frag + idx}
          >
            {frag}
          </Text>
        );
      })}
    </>
  );
}

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
          <Image
            src={imageUrl}
            alt="User image"
            width={36}
            height={36}
            style={{
              borderRadius: 4,
            }}
          />
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

interface PostReactionsFooterProps {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onLikeClick: () => void;
  onReportClick: () => void;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
}

function PostReactionsFooter({
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

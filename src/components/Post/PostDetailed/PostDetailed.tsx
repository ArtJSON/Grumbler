import { Button, Modal, Stack, Textarea, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import { useEffect } from "react";
import { z } from "zod";
import { api } from "../../../utils/api";
import { Content } from "../Content/Content";
import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../PostFragments/PostReactionsFooter/PostReactionsFooter";

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

  const form = useForm({
    validate: zodResolver(
      z.object({
        reason: z.string().max(320),
      })
    ),
    initialValues: {
      reason: "",
    },
  });
  const reportPostMutation = api.post.report.useMutation();
  const [opened, { open, close }] = useDisclosure(false);

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
      <Modal opened={opened} onClose={close} title="Report" size="md">
        <form
          onSubmit={form.onSubmit((values) => {
            reportPostMutation.mutate({
              postId: id,
              reason: values.reason,
            });
            form.reset();
            close();
          })}
        >
          <Textarea maxLength={320} {...form.getInputProps("reason")} />
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
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
        onReportClick={open}
      />
    </Stack>
  );
}

import { Modal, Textarea } from "@mantine/core";
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
import { useThemeContext } from "../../ThemeManager/ThemeManager";
import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../PostFragments/PostReactionsFooter/PostReactionsFooter";
import styles from "./PostDetailed.module.scss";

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
  viewsCount: number;
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
  const theme = useThemeContext();
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
    <div
      className={`${styles.postDetailed} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
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
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </form>
      </Modal>
      <PostInfoHeader
        imageUrl={imageUrl}
        displayName={displayName}
        username={username}
        createdAt={createdAt}
      />
      <div className={styles.content}>{content}</div>
      {extendedContent && <div className={styles.extendedContent}></div>}
      <RichTextEditor
        editor={editor}
        sx={{
          border: "none",
          ".ProseMirror": {
            padding: "0 !important",
            backgroundColor: `${
              theme.theme === "dark" ? "#111113" : "#fff"
            } !important`,
          },
        }}
        withCodeHighlightStyles
      >
        <RichTextEditor.Content />
      </RichTextEditor>
      <PostReactionsFooter
        likesCount={likesCount}
        commentsCount={commentsCount}
        liked={liked}
        onLikeClick={onLikeClick}
        onReportClick={open}
      />
    </div>
  );
}

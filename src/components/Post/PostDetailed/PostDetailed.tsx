import { RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../ThemeManager/ThemeManager";
import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../PostFragments/PostReactionsFooter/PostReactionsFooter";
import styles from "./PostDetailed.module.scss";

interface PostDetailedProps {
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
  imageUrl,
  displayName,
  username,
  createdAt,
  content,
  extendedContent,
  likesCount,
  commentsCount,
  viewsCount,
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
        viewsCount={viewsCount}
        liked={liked}
        onLikeClick={onLikeClick}
      />
    </div>
  );
}

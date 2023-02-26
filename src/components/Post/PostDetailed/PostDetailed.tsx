import { RichTextEditor } from "@mantine/tiptap";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { PostInfoHeader } from "../PostFragments/PostInfoHeader/PostInfoHeader";
import styles from "./PostDetailed.module.scss";

interface PostDetailedProps {
  imageUrl: string;
  displayName: string;
  username: string;
  createdAt: string;
  content: string;
  extendedContent?: string;
}

export function PostDetailed({
  imageUrl,
  displayName,
  username,
  createdAt,
  content,
  extendedContent,
}: PostDetailedProps) {
  const editor = useEditor({
    editable: false,
    content: extendedContent,
    extensions: [StarterKit, Underline, TextAlign],
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(extendedContent ?? "");
    }
  }, [extendedContent, editor]);

  return (
    <div className={styles.postDetailed}>
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
        styles={{
          root: {
            border: "none",
            ".ProseMirror": {
              padding: "0",
            },
          },
        }}
        withCodeHighlightStyles
      >
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}

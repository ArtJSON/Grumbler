import { RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import { useEffect } from "react";
import { useThemeContext } from "../../ThemeManager/ThemeManager";
import styles from "./AdminPost.module.scss";

interface AdminPostProps {
  content: string;
  extendedContent?: string;
}

export function AdminPost({ content, extendedContent }: AdminPostProps) {
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
      className={`${styles.adminPost} ${
        theme.theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.content}>{content}</div>
      {extendedContent && (
        <div className={styles.extendedContent}>
          <RichTextEditor
            editor={editor}
            sx={{
              border: "none",
              ".ProseMirror": {
                padding: "0 !important",
              },
            }}
            withCodeHighlightStyles
          >
            <RichTextEditor.Content />
          </RichTextEditor>
        </div>
      )}
    </div>
  );
}

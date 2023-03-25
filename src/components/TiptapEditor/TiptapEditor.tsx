import { RichTextEditor } from "@mantine/tiptap";
import type { Editor } from "@tiptap/react";
import { useRef } from "react";

export function TiptapEditor({
  extended,
  editor,
}: {
  extended: boolean;
  editor: Editor | null;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  return (
    <RichTextEditor
      editor={editor}
      withCodeHighlightStyles
      sx={{
        marginTop: extended ? 16 : 0,
        opacity: extended ? 1 : 0,
        height: extended
          ? (contentRef.current?.scrollHeight ?? 0) +
            (toolbarRef.current?.scrollHeight ?? 0)
          : 0,
        transition:
          "height 0.3s ease, opacity 0.2s, margin-top 0.2s !important",
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={0} ref={toolbarRef}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Code />
          <RichTextEditor.CodeBlock />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content ref={contentRef} />
    </RichTextEditor>
  );
}

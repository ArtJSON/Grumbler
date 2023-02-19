import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

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
      styles={{
        root: {
          height: extended
            ? contentRef.current?.scrollHeight! +
              toolbarRef.current?.scrollHeight!
            : 0,
          marginTop: extended ? 16 : 0,
          opacity: extended ? 1 : 0,
          overflow: "clip",
          transition: "height 0.3s ease, opacity 0.2s, margin-top 0.2s",
        },
        content: {
          overflowY: "scroll",
          maxHeight: 500,
        },
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

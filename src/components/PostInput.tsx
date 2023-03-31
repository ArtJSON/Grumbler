import { Button, Checkbox, Flex, Stack, Text, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { RichTextEditor } from "@mantine/tiptap";

interface PostInputProps {
  onSubmit: (content: string, extendedContent?: string) => void;
  defaultContent?: string;
  defaultExtendedContent?: string;
}

export function PostInput({
  onSubmit,
  defaultContent,
  defaultExtendedContent,
}: PostInputProps) {
  const [extended, setExtended] = useState(Boolean(defaultExtendedContent));

  const form = useForm({
    validate: zodResolver(
      z.object({
        content: z
          .string()
          .min(3, "Post must be at least 3 characters long!")
          .max(320),
      })
    ),
    initialValues: {
      content: defaultContent ? defaultContent : "",
    },
  });

  const editor = useEditor({
    content: defaultExtendedContent,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder: "Say something more..." }),
      CharacterCount.configure({
        limit: 5000,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
  });

  useEffect(() => {
    if (defaultContent) {
      form.setFieldValue("content", defaultContent);
    } else {
      form.setFieldValue("content", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultContent]);

  useEffect(() => {
    if (defaultExtendedContent) {
      editor?.commands.setContent(defaultExtendedContent);
    } else {
      editor?.commands.setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExtendedContent]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onSubmit(values.content, extended ? editor?.getHTML() : undefined);
        editor?.commands.clearContent();
        form.reset();
        setExtended(false);
      })}
    >
      <Stack>
        <Textarea
          withAsterisk
          placeholder="Tell others what you think..."
          maxLength={320}
          minRows={3}
          maxRows={8}
          autosize
          {...form.getInputProps("content")}
        />
        <Flex justify="space-between">
          <Checkbox
            label="Extended content"
            checked={extended}
            onChange={(event) => {
              setExtended(event.target.checked);
            }}
          />
          <Text size="sm">{form.values.content.length} / 320</Text>
        </Flex>
        <TiptapEditor extended={extended} editor={editor} />
        <Button type="submit" style={{ alignSelf: "flex-start" }}>
          Post
        </Button>
      </Stack>
    </form>
  );
}

function TiptapEditor({
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
        marginTop: extended ? 0 : -16,
        opacity: extended ? 1 : 0,
        overflow: "hidden",
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

import { Button, Checkbox, Flex, Stack, Text, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { TiptapEditor } from "../TiptapEditor/TiptapEditor";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import { useEditor } from "@tiptap/react";

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
  }, [defaultContent]);

  useEffect(() => {
    if (defaultExtendedContent) {
      editor?.commands.setContent(defaultExtendedContent);
    } else {
      editor?.commands.setContent("");
    }
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

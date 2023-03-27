import { Button, Checkbox, Flex, Stack, Text, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { TiptapEditor } from "../TiptapEditor/TiptapEditor";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import { useEditor } from "@tiptap/react";
import { api } from "../../utils/api";
import { useThemeContext } from "../ThemeManager/ThemeManager";

interface PostInputProps {
  onSubmit?: () => void;
}

export function PostInput({ onSubmit }: PostInputProps) {
  const [extended, setExtended] = useState(false);
  const theme = useThemeContext();
  const postCreateMutation = api.post.create.useMutation({
    onSuccess: () => {
      if (onSubmit) {
        onSubmit();
      }
    },
  });

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
      content: "",
    },
  });

  const editor = useEditor({
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

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        postCreateMutation.mutate({
          content: values.content,
          extendedConent: extended ? editor?.getHTML() : undefined,
        });
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
          <Text size="sm">{form.values.content.length} / 320 characters</Text>
        </Flex>
        <TiptapEditor extended={extended} editor={editor} />
        <Button type="submit" style={{ alignSelf: "flex-start" }}>
          Submit
        </Button>
      </Stack>
    </form>
  );
}

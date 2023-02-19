import styles from "./PostInput.module.scss";
import { Checkbox, Textarea } from "@mantine/core";
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

export function PostInput() {
  const [extended, setExtended] = useState(false);
  const postCreateMutation = api.post.create.useMutation();

  const form = useForm({
    validate: zodResolver(
      z.object({
        content: z
          .string()
          .min(10, "Post must be at least 10 characters long!")
          .max(320),
      })
    ),
    initialValues: {
      content: "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign,
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
      className={styles.postInput}
      onSubmit={form.onSubmit((values) => {
        postCreateMutation.mutate({
          content: values.content,
          extendedConent: extended ? editor!.getHTML() : undefined,
        });
      })}
    >
      <Textarea
        withAsterisk
        placeholder="Tell others what you think..."
        maxLength={320}
        minRows={3}
        autosize
        styles={{
          input: {
            fontSize: 16,
          },
        }}
        {...form.getInputProps("content")}
      />
      <div className={styles.options}>
        <Checkbox
          label="Extended content"
          styles={{ label: { fontSize: 12, paddingLeft: 4 } }}
          onChange={(event) => {
            setExtended(event.target.checked);
          }}
        />
        <span className={styles.contentLength}>
          {form.values.content.length} / 320 characters
        </span>
      </div>
      <TiptapEditor extended={extended} editor={editor} />
      <button className={styles.submitButton} type="submit">
        Submit
      </button>
    </form>
  );
}

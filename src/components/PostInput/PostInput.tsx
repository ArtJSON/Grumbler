import styles from "./PostInput.module.scss";
import { Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { TiptapEditor } from "../TiptapEditor/TiptapEditor";

export function PostInput() {
  const form = useForm({
    validate: zodResolver(
      z.object({
        content: z.string().min(3).max(320),
        extendedContent: z.string().min(3).max(5000).optional(),
      })
    ),
    initialValues: {
      content: "",
      extendedContent: undefined,
    },
  });

  return (
    <div className={styles.postInput}>
      <Textarea
        withAsterisk
        placeholder="Tell others what you think..."
        maxLength={320}
        minRows={3}
        autosize
        {...form.getInputProps("content")}
      />
      <span>{form.values.content.length} / 320 characters</span>
      <TiptapEditor />
    </div>
  );
}

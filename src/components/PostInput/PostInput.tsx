import styles from "./PostInput.module.scss";
import { Textarea, Button, Box, Code } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

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
      <Textarea
        withAsterisk
        placeholder="Tell us more..."
        maxLength={320}
        minRows={3}
        autosize
        {...form.getInputProps("extendedContent")}
      />
    </div>
  );
}

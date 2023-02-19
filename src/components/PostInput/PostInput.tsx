import styles from "./PostInput.module.scss";
import { Checkbox, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { TiptapEditor } from "../TiptapEditor/TiptapEditor";
import { useState } from "react";

export function PostInput() {
  const [extended, setExtended] = useState(false);

  const form = useForm({
    validate: zodResolver(
      z.object({
        content: z.string().min(3).max(320),
        extendedContent: z.string().min(3).optional(),
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
      <TiptapEditor extended={extended} />
    </div>
  );
}

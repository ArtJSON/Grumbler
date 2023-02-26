import { useForm, zodResolver } from "@mantine/form";
import styles from "./CommentInput.module.scss";
import { z } from "zod";
import { api } from "../../utils/api";
import { Textarea } from "@mantine/core";

interface CommentInputProps {
  postId: string;
  onSubmit?: () => void;
}

export function CommentInput({ postId, onSubmit }: CommentInputProps) {
  const commentCreateMutation = api.comment.comment.useMutation({
    onSuccess: () => {
      if (onSubmit) {
        onSubmit();
      }
    },
  });

  const form = useForm({
    validate: zodResolver(
      z.object({
        comment: z
          .string()
          .min(3, "Comment must be at least 3 characters long!")
          .max(320),
      })
    ),
    initialValues: {
      comment: "",
    },
  });

  return (
    <form
      className={styles.commentInput}
      onSubmit={form.onSubmit((values) => {
        commentCreateMutation.mutate({
          postId: postId,
          comment: values.comment,
        });
        form.reset();
      })}
    >
      <Textarea
        withAsterisk
        placeholder="Leave a comment..."
        maxLength={320}
        minRows={3}
        autosize
        styles={{
          input: {
            fontSize: 16,
          },
        }}
        {...form.getInputProps("comment")}
      />
      <div className={styles.footer}>
        <button className={styles.submitButton} type="submit">
          Submit
        </button>
        <span className={styles.contentLength}>
          {form.values.comment.length} / 320 characters
        </span>
      </div>
    </form>
  );
}

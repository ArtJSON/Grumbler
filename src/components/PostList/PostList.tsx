import {
  PostListingItem,
  type PostListingItemProps,
} from "./PostListingItem/PostListingItem";
import styles from "./PostList.module.scss";
import { Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useState } from "react";
import { api } from "../../utils/api";

interface PostListProps {
  posts: Omit<PostListingItemProps, "onReportClick">[];
}

export function PostList({ posts }: PostListProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [reportedPostId, setReportedPostId] = useState("");

  const reportPostMutation = api.post.report.useMutation();

  const form = useForm({
    validate: zodResolver(
      z.object({
        reason: z.string().max(320),
      })
    ),
    initialValues: {
      reason: "",
    },
  });

  if (posts.length) {
    return (
      <div className={styles.postList}>
        <Modal opened={opened} onClose={close} title="Report" size="md">
          <form
            onSubmit={form.onSubmit((values) => {
              reportPostMutation.mutate({
                postId: reportedPostId,
                reason: values.reason,
              });
              form.reset();
              close();
            })}
          >
            <Textarea maxLength={320} {...form.getInputProps("reason")} />
            <button className={styles.submitButton} type="submit">
              Submit
            </button>
          </form>
        </Modal>
        {posts.map((p) => (
          <PostListingItem
            key={p.id}
            {...p}
            onReportClick={() => {
              setReportedPostId(p.id);
              open();
            }}
          />
        ))}
      </div>
    );
  } else {
    return <div className={styles.emptyText}>No posts</div>;
  }
}

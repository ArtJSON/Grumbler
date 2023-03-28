import {
  PostListingItem,
  type PostListingItemProps,
} from "./PostListingItem/PostListingItem";
import { Button, Modal, Stack, Text, Textarea } from "@mantine/core";
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
      <Stack>
        <Modal opened={opened} onClose={close} title="Report">
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
            <Stack spacing={16} sx={{ alignSelf: "flex-start" }}>
              <Textarea
                minRows={3}
                maxRows={8}
                autosize
                maxLength={320}
                {...form.getInputProps("reason")}
              />
              <Button style={{ alignSelf: "flex-start" }} type="submit">
                Submit report
              </Button>
            </Stack>
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
      </Stack>
    );
  } else {
    return <Text align="center">No posts</Text>;
  }
}

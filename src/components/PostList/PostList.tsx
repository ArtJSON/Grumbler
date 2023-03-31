import {
  PostListingItem,
  type PostListingItemProps,
} from "./PostListingItem/PostListingItem";
import { Button, Loader, Modal, Stack, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { PostInput } from "../PostInput/PostInput";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";

interface PostListProps {
  posts: Omit<PostListingItemProps, "onReportClick">[];
  refetch: () => void;
}

export function PostList({ posts, refetch }: PostListProps) {
  const [reportedPostId, setReportedPostId] = useState("");
  const [
    reportModalOpened,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);

  const [editPostId, setEditPostId] = useState("");
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const { data } = useSession();

  if (posts.length) {
    return (
      <Stack>
        <ReportPostModal
          onClose={() => {
            closeReportModal();
            setReportedPostId("");
            refetch();
          }}
          opened={reportModalOpened}
          postId={reportedPostId}
        />
        <EditPostModal
          onClose={() => {
            closeEditModal();
            setEditPostId("");
            refetch();
          }}
          opened={editModalOpened}
          postId={editPostId}
        />
        {posts.map((p) => (
          <PostListingItem
            key={p.id}
            {...p}
            onReportClick={() => {
              setReportedPostId(p.id);
              openReportModal();
            }}
            onEditClick={
              data?.user.id === p.userId
                ? () => {
                    setEditPostId(p.id);
                    openEditModal();
                  }
                : undefined
            }
            onRemoveClick={
              data?.user.id === p.userId
                ? () => {
                    setEditPostId(p.id);
                    openEditModal();
                  }
                : undefined
            }
          />
        ))}
      </Stack>
    );
  } else {
    return <Text align="center">No posts</Text>;
  }
}

function EditPostModal({
  postId,
  opened,
  onClose,
}: {
  postId: string;
  opened: boolean;
  onClose: () => void;
}) {
  const { data: postData, refetch: postDataRefetch } =
    api.post.getByIdToUpdate.useQuery({ id: postId }, { enabled: false });
  const { mutateAsync: updateMutation } = api.post.update.useMutation({
    onSuccess: () => {
      notifications.show({ message: "Successfully edited post" });
    },
  });

  useEffect(() => {
    if (postId) {
      postDataRefetch();
    }
  }, [postId, postDataRefetch]);

  return (
    <Modal opened={opened} onClose={onClose} title="Edit" size="xl">
      {postData && (
        <PostInput
          onSubmit={async (content, extendedContent) => {
            await updateMutation({ postId, content, extendedContent });
            onClose();
          }}
          defaultContent={postData?.post.content}
          defaultExtendedContent={postData?.post.extendedContent}
        />
      )}
    </Modal>
  );
}

function ReportPostModal({
  postId,
  opened,
  onClose,
}: {
  postId: string;
  opened: boolean;
  onClose: () => void;
}) {
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

  return (
    <Modal opened={opened} onClose={onClose} title="Report">
      <form
        onSubmit={form.onSubmit(async (values) => {
          await reportPostMutation.mutateAsync({
            postId: postId,
            reason: values.reason,
          });
          onClose();
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
  );
}

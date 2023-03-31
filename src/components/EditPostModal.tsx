import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { api } from "../utils/api";
import { PostInput } from "./PostInput";

export function EditPostModal({
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

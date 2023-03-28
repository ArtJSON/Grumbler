import Head from "next/head";
import { useForm, zodResolver } from "@mantine/form";
import {
  Button,
  Group,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { z } from "zod";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { Photo, Upload, X } from "tabler-icons-react";
import { Loader } from "../../components/Loader/Loader";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";

const schema = z.object({
  displayName: z
    .string()
    .min(3)
    .max(32)
    .regex(/^\S+(?: \S+)*$/),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9._]+$/),
  bio: z.string().max(320),
});

export default function SettingsPage() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      displayName: "",
      username: "",
      bio: "",
    },
  });
  const router = useRouter();
  const updateSettingsMutation = api.user.updateSettings.useMutation();
  const { data: settingsData, isFetching } = api.user.getSettings.useQuery(
    {},
    {
      onSuccess: (data) => {
        form.setValues({
          bio: data.bio ?? "",
          displayName: data.displayName ?? "",
          username: data.username ?? "",
        });
      },
    }
  );
  const theme = useMantineTheme();

  if (!settingsData || isFetching) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | Settings</title>
      </Head>
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general">Gallery</Tabs.Tab>
          <Tabs.Tab value="image">Image</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general" pt="xs">
          <form
            onSubmit={form.onSubmit(async (values) => {
              await updateSettingsMutation.mutateAsync(values);
              router.reload();
            })}
          >
            <Stack>
              <TextInput
                {...form.getInputProps("displayName")}
                label="Display name"
              />
              <TextInput {...form.getInputProps("username")} label="Username" />
              <Textarea
                {...form.getInputProps("bio")}
                placeholder="Tell something about yourself..."
                label="Bio"
                maxLength={320}
                minRows={3}
                autosize
              />
              <Button type="submit" style={{ alignSelf: "flex-start" }}>
                Save changes
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="image" pt="xs">
          <Text size={14} weight="500" style={{ lineHeight: "26px" }}>
            Profile image
          </Text>
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={1024 ** 2}
            accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 220, pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <Upload color={theme.colors.teal[6]} size="3.2rem" />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <X color={theme.colors.red[6]} size="3.2rem" />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Text size={0}>
                  <Photo size="3.2rem" />
                </Text>
              </Dropzone.Idle>
              <div>
                <Text size="xl" inline>
                  Drag image here or click to select the file
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  Attach a picture in jpeg, jpg or png format up to 1MB
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

import styles from "./SettingsPage.module.scss";
import Head from "next/head";
import { useForm, zodResolver } from "@mantine/form";
import { Textarea, TextInput } from "@mantine/core";
import { z } from "zod";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useThemeContext } from "../../components/ThemeManager/ThemeManager";
import { Brightness, Login } from "tabler-icons-react";
import { signOut } from "next-auth/react";
import { Loader } from "../../components/Loader/Loader";

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
  const { data: settingsData } = api.user.getSettings.useQuery();
  const theme = useThemeContext();

  useEffect(() => {
    if (settingsData) {
      form.setValues({
        bio: settingsData?.bio ?? "",
        displayName: settingsData?.displayName ?? "",
        username: settingsData?.username ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsData]);

  if (!settingsData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | Settings</title>
      </Head>
      <div
        className={`${styles.settingsPage} ${
          theme.theme === "dark" ? styles.dark : ""
        }`}
      >
        <form
          className={styles.form}
          onSubmit={form.onSubmit(async (values) => {
            await updateSettingsMutation.mutate(values);
            router.reload();
          })}
        >
          <div
            className={styles.option}
            onClick={() => {
              signOut({
                callbackUrl: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout`,
              });
            }}
          >
            <Login size={24} strokeWidth={2} />
            <span className={styles.optionText}>Sign out</span>
          </div>
          <div className={styles.option} onClick={() => theme.toggleTheme()}>
            <Brightness size={24} strokeWidth={2} />
            <span className={styles.optionText}>Toggle theme</span>
          </div>
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
          <button className={styles.submitButton} type="submit">
            Save changes
          </button>
        </form>
      </div>
    </>
  );
}

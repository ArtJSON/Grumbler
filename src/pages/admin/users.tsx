import {
  Button,
  Checkbox,
  Modal,
  Pagination,
  Select,
  Table,
  Tabs,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ArrowsSort } from "tabler-icons-react";
import { Loader } from "../../components/Loader/Loader";
import { api } from "../../utils/api";
import styles from "./AdminPage.module.scss";
import { DatePicker } from "@mantine/dates";

export default function UsersPage() {
  const [sortOption, setSortOption] = useState("usr-asc");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUser] = useState("");
  const [banDate, setBanDate] = useState<Date | null>(null);

  const resetUserMutation = api.admin.resetUserData.useMutation();
  const updateRoleMutation = api.admin.updateRole.useMutation();
  const updateBanTimeMutation = api.admin.updateBanTime.useMutation();
  const removeUserMutation = api.admin.removeUser.useMutation();

  const { data: selectedUserData, refetch: refetchSelectedUserData } =
    api.admin.getUserData.useQuery(
      { userId: selectedUserId },
      {
        enabled: false,
      }
    );
  const { data: usersData, refetch: refetchUsersData } =
    api.admin.getUsers.useQuery({
      page: page,
      sortOption,
    });

  useEffect(() => {
    if (selectedUserId) {
      refetchSelectedUserData();
    }
  }, [selectedUserId]);

  const [opened, { open, close }] = useDisclosure(false);
  const resetUserForm = useForm({
    initialValues: {
      resetUsername: false,
      resetDisplayName: false,
      resetBio: false,
      removeAllPosts: false,
    },
  });
  const roleForm = useForm();

  const handleFormClose = () => {
    close();
    resetUserForm.reset();
    roleForm.reset();
    setSelectedUser("");
    setBanDate(null);
  };

  const handleSortCLick = (newSortOption: string) => {
    if (newSortOption === sortOption.substring(0, 3)) {
      if (sortOption.substring(4, 7) === "asc") {
        setSortOption(newSortOption + "-des");
      } else {
        setSortOption(newSortOption + "-asc");
      }
    } else {
      setSortOption(newSortOption + "-asc");
    }
  };

  if (!usersData) {
    return <Loader />;
  }

  return (
    <div className={styles.adminPage}>
      <Modal
        opened={opened}
        onClose={handleFormClose}
        title="Manage"
        className={styles.modal}
        size="lg"
      >
        <Tabs color="indigo" defaultValue="reset">
          <Tabs.List>
            <Tabs.Tab value="reset">Reset user data</Tabs.Tab>
            <Tabs.Tab value="role">Change role</Tabs.Tab>
            <Tabs.Tab value="ban">Change ban time</Tabs.Tab>
            <Tabs.Tab value="remove" color="red">
              Remove user
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="reset" pt="md">
            <form
              onSubmit={resetUserForm.onSubmit((values) => {
                resetUserMutation
                  .mutateAsync({
                    ...values,
                    userId: selectedUserId,
                  })
                  .then(() => {
                    refetchUsersData();
                  });
                handleFormClose();
              })}
              className={styles.actionForm}
            >
              <Checkbox
                label="Username"
                {...resetUserForm.getInputProps("resetUsername", {
                  type: "checkbox",
                })}
              />
              <Checkbox
                label="Display nme"
                {...resetUserForm.getInputProps("resetDisplayName", {
                  type: "checkbox",
                })}
              />
              <Checkbox
                label="Bio"
                {...resetUserForm.getInputProps("resetBio", {
                  type: "checkbox",
                })}
              />
              <Checkbox
                color="red"
                label="Remove all posts"
                {...resetUserForm.getInputProps("removeAllPosts", {
                  type: "checkbox",
                })}
              />
              <Button
                type="submit"
                mt={8}
                color={resetUserForm.values.removeAllPosts ? "red" : "blue"}
                style={{
                  transition: "0.2s background-color",
                }}
              >
                Reset data
              </Button>
            </form>
          </Tabs.Panel>
          <Tabs.Panel value="role" pt="md">
            {selectedUserData && (
              <form
                onSubmit={roleForm.onSubmit((values) => {
                  updateRoleMutation
                    .mutateAsync({
                      userId: selectedUserId,
                      role: values.newRole as string,
                    })
                    .then(() => {
                      refetchUsersData();
                    });
                  handleFormClose();
                })}
                className={styles.actionForm}
              >
                <Select
                  data={["USER", "ADMIN"]}
                  label="Role"
                  {...roleForm.getInputProps("newRole")}
                  defaultValue={selectedUserData.role}
                  zIndex={1000}
                />
                <Button type="submit" mt={8}>
                  Save changes
                </Button>
              </form>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="ban" pt="md">
            {selectedUserData && (
              <>
                <Group position="center">
                  <DatePicker
                    defaultDate={selectedUserData.banTime}
                    defaultValue={selectedUserData.banTime}
                    minDate={new Date()}
                    onChange={setBanDate}
                  />
                </Group>
                <Button
                  mt={8}
                  onClick={() => {
                    if (banDate) {
                      updateBanTimeMutation
                        .mutateAsync({
                          userId: selectedUserId,
                          newBanTime: banDate,
                        })
                        .then(() => {
                          refetchUsersData();
                        });
                      handleFormClose();
                    }
                  }}
                  disabled={banDate === null}
                >
                  Save changes
                </Button>
              </>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="remove" pt="md">
            <Text>This action is destructive and irreversible</Text>
            <Group position="center">
              <Button
                color="red"
                mt={16}
                onClick={() => {
                  removeUserMutation
                    .mutateAsync({
                      userId: selectedUserId,
                    })
                    .then(() => {
                      refetchUsersData();
                    });
                  handleFormClose();
                }}
              >
                Remove user
              </Button>
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Modal>
      <UserTable
        onActionClick={(id) => {
          setSelectedUser(id);
          open();
        }}
        onSortClick={handleSortCLick}
        users={usersData.users}
      />
      <div className={styles.paginationContainer}>
        <Pagination total={usersData.pages} value={page} onChange={setPage} />
      </div>
    </div>
  );
}

function UserTable({
  users,
  onSortClick,
  onActionClick,
}: {
  users: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    followers: number;
    joinedAt: string;
    bannedUntil: string;
    email: string;
  }[];
  onSortClick: (option: string) => void;
  onActionClick: (id: string) => void;
}) {
  const ths = (
    <tr>
      <th
        className={styles.sortHeader}
        onClick={() => {
          onSortClick("usr");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Username
      </th>
      <th
        className={styles.sortHeader}
        onClick={() => {
          onSortClick("dsp");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Display name
      </th>
      <th
        className={styles.sortHeader}
        onClick={() => {
          onSortClick("rol");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Role
      </th>
      <th
        className={styles.sortHeader}
        onClick={() => {
          onSortClick("flw");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Followers
      </th>
      <th
        className={styles.sortHeader}
        onClick={() => {
          onSortClick("jdt");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Joined at
      </th>
      <th
        className={styles.sortHeader}
        onClick={() => {
          onSortClick("bdu");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Banned until
      </th>
      <th>E-mail</th>
      <th>Action</th>
    </tr>
  );

  const rows = users.map((r) => (
    <tr key={r.id}>
      <td>{r.username}</td>
      <td>{r.displayName}</td>
      <td>{r.role}</td>
      <td>{r.followers}</td>
      <td>{r.joinedAt}</td>
      <td>{r.bannedUntil}</td>
      <td>{r.email}</td>
      <td className={styles.narrowField}>
        <button
          className={styles.actionButton}
          onClick={() => {
            onActionClick(r.id);
          }}
        >
          Manage
        </button>
      </td>
    </tr>
  ));

  return (
    <Table className={styles.table}>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

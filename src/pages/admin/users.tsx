import { Modal, Pagination, Table, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ArrowsSort } from "tabler-icons-react";
import { Loader } from "../../components/Loader/Loader";
import { api } from "../../utils/api";
import styles from "./AdminPage.module.scss";

// User management options:
// - reset user data
// - remove user
// - change ban time
// - change role

export default function UsersPage() {
  const [sortOption, setSortOption] = useState("usr-asc");
  const [page, setPage] = useState(1);
  const { data: usersData, refetch: refetchUsersData } =
    api.admin.getUsers.useQuery({
      page: page,
      sortOption,
    });
  const [opened, { open, close }] = useDisclosure(false);

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
        onClose={close}
        title="Manage"
        className={styles.modal}
      >
        <Tabs color="indigo" defaultValue="reset">
          <Tabs.List>
            <Tabs.Tab value="reset">Reset user data</Tabs.Tab>
            <Tabs.Tab value="role">Change role</Tabs.Tab>
            <Tabs.Tab value="ban">Change ban time</Tabs.Tab>
            <Tabs.Tab value="remove">Remove user</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="reset" pt="md">
            Reset
          </Tabs.Panel>
          <Tabs.Panel value="role" pt="md">
            Role
          </Tabs.Panel>
          <Tabs.Panel value="ban" pt="md">
            Ban
          </Tabs.Panel>
          <Tabs.Panel value="remove" pt="md">
            Remove
          </Tabs.Panel>
        </Tabs>
      </Modal>
      <UserTable
        onActionClick={() => {
          open();
        }}
        onSortClick={handleSortCLick}
        users={usersData.users}
      />
      <div className={styles.paginationContainer}>
        <Pagination total={usersData.pages} page={page} onChange={setPage} />
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

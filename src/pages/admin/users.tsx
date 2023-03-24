import { Table } from "@mantine/core";
import { ArrowsSort, Triangle, TriangleInverted } from "tabler-icons-react";
import styles from "./AdminPage.module.scss";

export default function UsersPage() {
  return (
    <div className={styles.adminPage}>
      <UserTable onReviewClick={() => {}} onSortClick={() => {}} users={[]} />
    </div>
  );
}

function UserTable({
  users,
  onSortClick,
  onReviewClick,
}: {
  users: {
    id: string;
    postId: string;
    createdAt: string;
    reason: string;
  }[];
  onSortClick: (option: string) => void;
  onReviewClick: (id: string) => void;
}) {
  const ths = (
    <tr>
      <th
        onClick={() => {
          onSortClick("username");
        }}
      >
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Username
      </th>
      <th>Display name</th>
      <th>E-mail</th>
      <th>Role</th>
      <th>Bio</th>
      <th>Followers</th>
    </tr>
  );

  const rows = users.map((r) => (
    <tr key={r.id}>
      <td></td>
      <td className={styles.narrowField}>
        <button className={styles.actionButton}>Review</button>
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

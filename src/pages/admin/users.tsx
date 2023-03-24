import { Table } from "@mantine/core";
import { ArrowsSort } from "tabler-icons-react";
import styles from "./AdminPage.module.scss";

export default function UsersPage() {
  return <div></div>;
}

function UserTable({
  reports,
  onSortClick,
  onReviewClick,
}: {
  reports: {
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

  const rows = reports.map((r) => (
    <tr key={r.id}>
      <td className={styles.narrowField}>{r.createdAt}</td>
      <td className={styles.elipsisField}>{r.reason}</td>
      <td className={styles.narrowField}>
        <button
          className={styles.actionButton}
          onClick={() => onReviewClick(r.id)}
        >
          Review
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

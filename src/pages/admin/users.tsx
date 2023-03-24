import { Table } from "@mantine/core";
import { useState } from "react";
import { ArrowsSort, Triangle, TriangleInverted } from "tabler-icons-react";
import styles from "./AdminPage.module.scss";

export default function UsersPage() {
  const [sortOption, setSortOption] = useState("usr-asc");

  console.log(sortOption);

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

  return (
    <div className={styles.adminPage}>
      <UserTable
        onReviewClick={() => {}}
        onSortClick={handleSortCLick}
        users={[]}
      />
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

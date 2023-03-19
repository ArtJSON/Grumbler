import { Table, Pagination, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ArrowsSort } from "tabler-icons-react";
import { api } from "../../utils/api";

import styles from "./AdminPage.module.scss";

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("asc");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedReport, setSelectedReport] = useState("");

  const { data: reportsData } = api.admin.getReports.useQuery({
    page: page,
    sortOption,
  });

  const { data: postData } = api.admin.getReportedPost.useQuery({
    reportId: selectedReport,
  });

  if (!reportsData) {
    return <></>;
  }

  console.log(postData);

  return (
    <div className={styles.adminPage}>
      <Modal opened={opened} onClose={close} title="Review"></Modal>
      <ReportsTable
        onReviewClick={(id) => {
          setSelectedReport(id);
          open();
        }}
        onSortClick={() => {
          setSortOption((prev) => (prev === "asc" ? "desc" : "asc"));
        }}
        reports={reportsData.reports}
      />
      <div className={styles.paginationContainer}>
        <Pagination total={reportsData.pages} page={page} onChange={setPage} />
      </div>
    </div>
  );
}

function ReportsTable({
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
  onSortClick: () => void;
  onReviewClick: (id: string) => void;
}) {
  const ths = (
    <tr>
      <th onClick={onSortClick}>
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Reported at
      </th>
      <th>Reason</th>
      <th>Action</th>
    </tr>
  );

  const rows = reports.map((r) => (
    <tr key={r.id}>
      <td className={styles.narrowField}>{r.createdAt}</td>
      <td className={styles.elipsisField}>{r.reason}</td>
      <td className={styles.narrowField}>
        <button
          className={styles.reviewButton}
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

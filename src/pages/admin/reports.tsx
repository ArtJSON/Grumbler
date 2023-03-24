import { Table, Pagination, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ArrowsSort, Ban, ThumbUp } from "tabler-icons-react";
import { AdminPost } from "../../components/Post/AdminPost/AdminPost";
import { api } from "../../utils/api";

import styles from "./AdminPage.module.scss";

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("asc");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedReport, setSelectedReport] = useState("");
  const reviewReportMutation = api.admin.reviewReport.useMutation();

  const { data: reportsData, refetch: refetchReportsData } =
    api.admin.getReports.useQuery({
      page: page,
      sortOption,
    });

  const { data: selectedReportData, refetch: selectedReportDataRefetch } =
    api.admin.getReportedPost.useQuery(
      {
        reportId: selectedReport,
      },
      {
        enabled: false,
      }
    );

  useEffect(() => {
    if (selectedReport) {
      selectedReportDataRefetch();
    }
  }, [selectedReport]);

  if (!reportsData) {
    return <></>;
  }

  return (
    <div className={styles.adminPage}>
      <Modal
        opened={opened}
        onClose={close}
        title="Review"
        className={styles.modal}
      >
        {selectedReportData && (
          <AdminPost
            content={selectedReportData.post.content}
            extendedContent={
              selectedReportData.post.extendedContent ?? undefined
            }
          />
        )}
        <div className={styles.actionsContainer}>
          <button
            className={styles.positive}
            onClick={async () => {
              await reviewReportMutation.mutate({
                reportId: selectedReport,
                shouldPostBeRemoved: false,
              });
              refetchReportsData();
              setSelectedReport("");
              close();
            }}
          >
            <ThumbUp size={20} />
            <Text>Leave</Text>
          </button>
          <button
            className={styles.danger}
            onClick={async () => {
              await reviewReportMutation.mutate({
                reportId: selectedReport,
                shouldPostBeRemoved: true,
              });
              refetchReportsData();
              setSelectedReport("");
              close();
            }}
          >
            <Ban size={20} />
            <span>Remove</span>
          </button>
        </div>
      </Modal>
      <ReportsTable
        onReviewClick={(id) => {
          setSelectedReport(id);
          open();
        }}
        onSortClick={() => {
          setSortOption((prev) => (prev === "asc" ? "desc" : "asc"));
        }}
        reports={[...reportsData.reports]}
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

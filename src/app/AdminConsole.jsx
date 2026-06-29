import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppTheme } from "./AppThemeContext";
import {
  canRemoveReportedContent,
  contentReportLabel,
  getAccountDeletionReviewQueue,
  getContentReportQueue,
  getSupportReviewQueue,
  processAccountDeletion,
  reviewAccountDeletionRequest,
  reviewContentReport,
  reviewSupportRequest,
} from "../userService";

const ADMIN_SECTIONS = [
  { id: "content", label: "Reports" },
  { id: "support", label: "Support" },
  { id: "deletion", label: "Deletion" },
];

function formatDate(value) {
  const date = value?.toDate?.() || value?.dateValue?.() || null;
  if (!date) return "Not dated";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function reviewerName(user) {
  return user?.displayName || user?.email || user?.uid || "admin";
}

function queueCardStyle(theme) {
  return {
    padding: 14,
    borderRadius: 8,
    background: theme.cardBgStrong,
    border: `1px solid ${theme.cardBorder}`,
    display: "grid",
    gap: 10,
  };
}

function ActionButton({ children, disabled, onClick, tone = "default" }) {
  const { theme } = useAppTheme();
  const tones = {
    default: { bg: theme.cardBg, color: theme.text },
    primary: { bg: "#FF6B35", color: "#080808" },
    danger: { bg: "#F87171", color: "#080808" },
    success: { bg: "#34D399", color: "#080808" },
  };
  const palette = tones[tone] || tones.default;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 36,
        padding: "8px 10px",
        border: `1px solid ${theme.cardBorderStrong}`,
        borderRadius: 8,
        background: disabled ? theme.cardBg : palette.bg,
        color: disabled ? theme.mutedStrong : palette.color,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: 0,
      }}
    >
      {children}
    </button>
  );
}

function QueueNote({ note, onChange, placeholder }) {
  const { theme } = useAppTheme();

  return (
    <textarea
      value={note}
      onChange={event => onChange(event.target.value.slice(0, 500))}
      placeholder={placeholder}
      style={{
        minHeight: 74,
        resize: "vertical",
        borderRadius: 8,
        border: `1px solid ${theme.inputBorder}`,
        background: theme.inputBg,
        color: theme.text,
        padding: 10,
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 1.45,
        outline: "none",
      }}
    />
  );
}

function EmptyQueue({ label }) {
  const { theme } = useAppTheme();
  return (
    <div style={{
      padding: 18,
      borderRadius: 8,
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      color: theme.textSoft,
      fontSize: 12,
      fontWeight: 700,
      textAlign: "center",
    }}>
      No open {label}.
    </div>
  );
}

function AdminHeader({ activeSection, counts, onReload, setActiveSection, working }) {
  const { theme } = useAppTheme();

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: theme.mutedStrong, fontWeight: 900 }}>
            ADMIN OPERATIONS
          </div>
          <h1 style={{ margin: "4px 0 0", fontSize: 28, lineHeight: 1, fontFamily: "Syne", letterSpacing: 0 }}>
            Review queues
          </h1>
        </div>
        <ActionButton disabled={working} onClick={onReload} tone="primary">
          {working ? "Refreshing" : "Refresh"}
        </ActionButton>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 8,
      }}>
        <SummaryStat label="Reports" value={counts.content} />
        <SummaryStat label="Support" value={counts.support} />
        <SummaryStat label="Deletion" value={counts.deletion} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {ADMIN_SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              flex: 1,
              minHeight: 40,
              border: `1px solid ${activeSection === section.id ? "#FF6B35" : theme.cardBorder}`,
              borderRadius: 8,
              background: activeSection === section.id ? "#FF6B35" : theme.cardBgStrong,
              color: activeSection === section.id ? "#080808" : theme.text,
              fontSize: 11,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryStat({ label, value }) {
  const { theme } = useAppTheme();
  return (
    <div style={{
      padding: 12,
      borderRadius: 8,
      border: `1px solid ${theme.cardBorder}`,
      background: theme.cardBg,
    }}>
      <div style={{ fontSize: 10, fontFamily: "monospace", color: theme.mutedStrong, fontWeight: 900 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ marginTop: 4, fontSize: 24, fontWeight: 900, color: theme.text }}>
        {value}
      </div>
    </div>
  );
}

function ContentReportQueue({ notes, onAction, onNoteChange, reports, workingId }) {
  const { theme } = useAppTheme();
  if (!reports.length) return <EmptyQueue label="content reports" />;

  return reports.map(report => {
    const removable = canRemoveReportedContent(report);
    return (
      <div key={report.id} style={queueCardStyle(theme)}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900 }}>{contentReportLabel(report.contentType)}</div>
            <div style={{ marginTop: 3, fontSize: 11, color: theme.textSoft }}>
              {report.reason || "Reported from app"}
            </div>
          </div>
          <div style={{ fontSize: 10, color: theme.mutedStrong, textAlign: "right", whiteSpace: "nowrap" }}>
            {formatDate(report.createdAt)}
          </div>
        </div>
        {report.details && (
          <div style={{ fontSize: 11, color: theme.textSoft, lineHeight: 1.45 }}>
            {report.details}
          </div>
        )}
        <div style={{ fontSize: 10, color: theme.mutedStrong, fontFamily: "monospace" }}>
          Status: {report.status || "open"} | Reported user: {report.reportedUid || "n/a"}
        </div>
        <QueueNote
          note={notes[report.id] || ""}
          onChange={value => onNoteChange(report.id, value)}
          placeholder="Moderation note"
        />
        <div style={{ display: "grid", gridTemplateColumns: removable ? "repeat(4, 1fr)" : "repeat(3, 1fr)", gap: 8 }}>
          <ActionButton disabled={workingId === report.id} onClick={() => onAction(report, { status: "reviewing" })}>
            Reviewing
          </ActionButton>
          <ActionButton disabled={workingId === report.id} onClick={() => onAction(report, { status: "resolved" })} tone="success">
            Resolve
          </ActionButton>
          <ActionButton disabled={workingId === report.id} onClick={() => onAction(report, { status: "dismissed" })}>
            Dismiss
          </ActionButton>
          {removable && (
            <ActionButton
              disabled={workingId === report.id}
              onClick={() => onAction(report, { status: "resolved", removeContent: true })}
              tone="danger"
            >
              Remove
            </ActionButton>
          )}
        </div>
      </div>
    );
  });
}

function SupportQueue({ notes, onAction, onNoteChange, requests, workingId }) {
  const { theme } = useAppTheme();
  if (!requests.length) return <EmptyQueue label="support requests" />;

  return requests.map(request => (
    <div key={request.id} style={queueCardStyle(theme)}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900 }}>{request.category || "general"}</div>
          <div style={{ marginTop: 3, fontSize: 11, color: theme.textSoft }}>
            {request.email || request.uid || "Unknown user"}
          </div>
        </div>
        <div style={{ fontSize: 10, color: theme.mutedStrong, textAlign: "right", whiteSpace: "nowrap" }}>
          {formatDate(request.createdAt)}
        </div>
      </div>
      <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.45 }}>
        {request.message}
      </div>
      <QueueNote
        note={notes[request.id] || ""}
        onChange={value => onNoteChange(request.id, value)}
        placeholder="Support follow-up note"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "waiting")}>
          Waiting
        </ActionButton>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "resolved")} tone="success">
          Resolved
        </ActionButton>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "closed")}>
          Closed
        </ActionButton>
      </div>
    </div>
  ));
}

function DeletionQueue({ notes, onAction, onNoteChange, onProcess, requests, workingId }) {
  const { theme } = useAppTheme();
  if (!requests.length) return <EmptyQueue label="account deletion requests" />;

  return requests.map(request => (
    <div key={request.id} style={queueCardStyle(theme)}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900 }}>{request.email || request.uid}</div>
          <div style={{ marginTop: 3, fontSize: 11, color: theme.textSoft }}>
            {request.displayName || "Account deletion request"}
          </div>
        </div>
        <div style={{ fontSize: 10, color: theme.mutedStrong, textAlign: "right", whiteSpace: "nowrap" }}>
          {formatDate(request.requestedAt)}
        </div>
      </div>
      <div style={{ fontSize: 11, color: theme.textSoft, lineHeight: 1.45 }}>
        Status: {request.status || "requested"}. Mark verified only after confirming the requester owns the account. Processing deletes private account data and Firebase Auth, then anonymizes shared records. It does not cancel subscriptions or process refunds.
      </div>
      <QueueNote
        note={notes[request.id] || ""}
        onChange={value => onNoteChange(request.id, value)}
        placeholder="Deletion review note"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "contacted")}>
          Contacted
        </ActionButton>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "verified")} tone="success">
          Verified
        </ActionButton>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "blocked")} tone="danger">
          Blocked
        </ActionButton>
        <ActionButton disabled={workingId === request.id} onClick={() => onAction(request, "closed")}>
          Closed
        </ActionButton>
      </div>
      {request.status === "verified" && (
        <ActionButton disabled={workingId === request.id} onClick={() => onProcess(request)} tone="danger">
          Process deletion
        </ActionButton>
      )}
    </div>
  ));
}

export default function AdminConsole({ isAdmin, user }) {
  const { theme } = useAppTheme();
  const [activeSection, setActiveSection] = useState("content");
  const [contentReports, setContentReports] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);
  const [workingId, setWorkingId] = useState("");
  const counts = useMemo(() => ({
    content: contentReports.length,
    support: supportRequests.length,
    deletion: deletionRequests.length,
  }), [contentReports.length, deletionRequests.length, supportRequests.length]);

  const loadQueues = useCallback(async () => {
    if (!isAdmin) return;
    setWorking(true);
    setMessage("");
    try {
      const [reports, support, deletion] = await Promise.all([
        getContentReportQueue(),
        getSupportReviewQueue(),
        getAccountDeletionReviewQueue(),
      ]);
      setContentReports(reports);
      setSupportRequests(support);
      setDeletionRequests(deletion);
    } catch (error) {
      setMessage(error.message || "Could not load admin queues.");
    } finally {
      setWorking(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  const setNote = (id, value) => {
    setNotes(current => ({ ...current, [id]: value }));
  };

  const runAction = async (id, action) => {
    setWorkingId(id);
    setMessage("");
    try {
      await action();
      setNotes(current => ({ ...current, [id]: "" }));
      await loadQueues();
      setMessage("Queue updated.");
    } catch (error) {
      setMessage(error.message || "Could not update queue item.");
    } finally {
      setWorkingId("");
    }
  };

  const onContentAction = (report, { status, removeContent = false }) => runAction(report.id, () => reviewContentReport(report.id, {
    removeContent,
    reviewNote: notes[report.id] || "",
    reviewedBy: reviewerName(user),
    status,
  }));

  const onSupportAction = (request, status) => runAction(request.id, () => reviewSupportRequest(request.id, {
    reviewNote: notes[request.id] || "",
    reviewedBy: reviewerName(user),
    status,
  }));

  const onDeletionAction = (request, status) => runAction(request.id, () => reviewAccountDeletionRequest(request.uid || request.id, {
    reviewNote: notes[request.id] || "",
    reviewedBy: reviewerName(user),
    status,
  }));

  const onDeletionProcess = request => {
    const confirmed = window.confirm(
      "Process permanent account deletion for this user? This deletes private account data and Firebase Auth, then anonymizes shared records. Subscriptions and refunds still need to be handled outside this console.",
    );
    if (!confirmed) return Promise.resolve();
    return runAction(request.id, () => processAccountDeletion(request.uid || request.id, {
      reviewNote: notes[request.id] || "",
    }));
  };

  if (!isAdmin) {
    return (
      <main style={{ padding: "64px 18px 24px", display: "grid", gap: 14 }}>
        <h1 style={{ margin: 0, fontFamily: "Syne", fontSize: 28 }}>Admin access</h1>
        <p style={{ margin: 0, color: theme.textSoft, lineHeight: 1.5, fontSize: 13 }}>
          This console is available only to accounts listed in the admin roster.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "64px 14px 24px", display: "grid", gap: 16 }}>
      <AdminHeader
        activeSection={activeSection}
        counts={counts}
        onReload={loadQueues}
        setActiveSection={setActiveSection}
        working={working}
      />

      <div style={{
        padding: 12,
        borderRadius: 8,
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.textSoft,
        fontSize: 11,
        lineHeight: 1.45,
      }}>
        Admin actions are review, safety, and verified account deletion workflows. Billing, refunds, subscription cancellation, and entitlement grants stay outside this console.
      </div>

      {message && (
        <div style={{
          padding: 12,
          borderRadius: 8,
          background: message.includes("Could not") ? "rgba(248,113,113,0.12)" : "rgba(52,211,153,0.12)",
          color: message.includes("Could not") ? "#FCA5A5" : "#34D399",
          border: `1px solid ${message.includes("Could not") ? "rgba(248,113,113,0.24)" : "rgba(52,211,153,0.24)"}`,
          fontSize: 12,
          fontWeight: 800,
        }}>
          {message}
        </div>
      )}

      <section style={{ display: "grid", gap: 10 }}>
        {activeSection === "content" && (
          <ContentReportQueue
            notes={notes}
            onAction={onContentAction}
            onNoteChange={setNote}
            reports={contentReports}
            workingId={workingId}
          />
        )}
        {activeSection === "support" && (
          <SupportQueue
            notes={notes}
            onAction={onSupportAction}
            onNoteChange={setNote}
            requests={supportRequests}
            workingId={workingId}
          />
        )}
        {activeSection === "deletion" && (
          <DeletionQueue
            notes={notes}
            onAction={onDeletionAction}
            onNoteChange={setNote}
            onProcess={onDeletionProcess}
            requests={deletionRequests}
            workingId={workingId}
          />
        )}
      </section>
    </main>
  );
}

import { useEffect, useState } from 'react';
import {
  sendChallengeAnnouncement,
  sendChallengeLogReminder,
  sendChallengeMemberMessage,
  subscribeChallengeMessages,
} from '../challengeMessageService';

function timestampToDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function timeAgo(value) {
  const date = timestampToDate(value);
  if (!date) return 'now';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function typeLabel(type) {
  if (type === 'log_reminder') return 'LOG REMINDER';
  if (type === 'member_message') return 'MESSAGE';
  return 'ANNOUNCEMENT';
}

function typeIcon(type) {
  if (type === 'log_reminder') return '⏰';
  if (type === 'member_message') return '💬';
  return '📣';
}

export default function ChallengeUpdatesCard({ challenge, memberData, user }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const isAdmin = memberData?.role === 'admin' || challenge.createdBy === user.uid;
  const community = challenge.community || {};
  const announcementsEnabled = community.announcementsEnabled !== false;
  const memberMessagesEnabled = community.memberMessagesEnabled === true;
  const canPostMemberMessage = memberMessagesEnabled && !!memberData;
  const senderName = memberData?.displayName || user.displayName || user.email || (isAdmin ? 'Challenge admin' : 'Tribe member');

  useEffect(() => {
    if (!challenge?.id) return undefined;
    return subscribeChallengeMessages(challenge.id, setMessages, 10);
  }, [challenge?.id]);

  const sendAnnouncement = async () => {
    const message = draft.trim();
    if (!message) return;
    setSending(true);
    try {
      await sendChallengeAnnouncement({ challenge, message, senderUid: user.uid, senderName });
      setDraft('');
    } finally {
      setSending(false);
    }
  };

  const sendMemberMessage = async () => {
    const message = draft.trim();
    if (!message) return;
    setSending(true);
    try {
      await sendChallengeMemberMessage({ challenge, message, senderUid: user.uid, senderName });
      setDraft('');
    } finally {
      setSending(false);
    }
  };

  const sendReminder = async () => {
    setSending(true);
    try {
      await sendChallengeLogReminder({ challenge, senderUid: user.uid, senderName });
    } finally {
      setSending(false);
    }
  };

  return (
    <section style={{
      margin: '0 20px',
      padding: 16,
      borderRadius: 18,
      background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.07))',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#777', fontSize: 11, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}>
            CHALLENGE UPDATES
          </div>
          <h3 style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontFamily: "'Syne', sans-serif" }}>
            Keep the tribe moving
          </h3>
        </div>
        <span style={{ fontSize: 24 }}>📣</span>
      </div>

      {(isAdmin || canPostMemberMessage) && (
        <div style={{ marginTop: 14 }}>
          <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
            maxLength={280}
            placeholder={isAdmin ? 'Post a quick update for this challenge...' : 'Message the challenge...'}
            style={{
              width: '100%',
              minHeight: 72,
              resize: 'vertical',
              boxSizing: 'border-box',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              padding: 12,
              font: '600 13px Space Grotesk, sans-serif',
              outline: 'none',
            }}
          />
          {isAdmin ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={announcementsEnabled ? sendAnnouncement : sendMemberMessage}
                disabled={sending || !draft.trim()}
                style={{
                  border: 0,
                  borderRadius: 12,
                  padding: '11px 10px',
                  background: draft.trim() ? '#FF6B35' : 'rgba(255,255,255,0.08)',
                  color: draft.trim() ? '#050505' : '#777',
                  fontWeight: 900,
                  cursor: draft.trim() && !sending ? 'pointer' : 'default',
                }}
              >
                {announcementsEnabled ? 'Send Update' : 'Send Message'}
              </button>
              <button
                type="button"
                onClick={sendReminder}
                disabled={sending}
                style={{
                  border: '1px solid rgba(255,215,0,0.32)',
                  borderRadius: 12,
                  padding: '11px 10px',
                  background: 'rgba(255,215,0,0.12)',
                  color: '#FFD700',
                  fontWeight: 900,
                  cursor: sending ? 'default' : 'pointer',
                }}
              >
                Remind to Log
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={sendMemberMessage}
              disabled={sending || !draft.trim()}
              style={{
                width: '100%',
                marginTop: 8,
                border: 0,
                borderRadius: 12,
                padding: '11px 10px',
                background: draft.trim() ? '#FF6B35' : 'rgba(255,255,255,0.08)',
                color: draft.trim() ? '#050505' : '#777',
                fontWeight: 900,
                cursor: draft.trim() && !sending ? 'pointer' : 'default',
              }}
            >
              Send Message
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
        {messages.length === 0 ? (
          <div style={{
            padding: 12,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            color: '#888',
            fontSize: 12,
            lineHeight: 1.45,
            fontWeight: 700,
          }}>
            {memberMessagesEnabled
              ? 'No updates yet. Admins can post reminders and members can share a quick message.'
              : 'No updates yet. Admins can post a reminder when the tribe needs a push.'}
          </div>
        ) : messages.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            gap: 10,
            padding: 12,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <span style={{ fontSize: 20, lineHeight: '22px' }}>{typeIcon(item.type)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: '#FFD700', fontSize: 9, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}>
                  {typeLabel(item.type)}
                </span>
                <span style={{ color: '#666', fontSize: 9, fontWeight: 800 }}>{timeAgo(item.createdAt)}</span>
              </div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, lineHeight: 1.35, fontWeight: 800 }}>
                {item.message}
              </p>
              <p style={{ margin: '5px 0 0', color: '#777', fontSize: 11, fontWeight: 700 }}>
                {item.senderName || 'Challenge admin'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

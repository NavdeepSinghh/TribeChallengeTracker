import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  CHALLENGE_TEMPLATES, createChallenge, joinChallenge,
  isMember, getChallenge, getChallengeByInviteCode, getUserChallenges,
} from './challengeService';
import ChallengeTrackerScreen from './ChallengeTrackerScreen';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';

const todayStr = () => new Date().toISOString().split('T')[0];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18, padding: 18,
};

// ─── CHALLENGE CARD (list item) ───────────────────────────────────────────────
function ChallengeCard({ challenge, isOwner, onClick }) {
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  ));
  return (
    <button onClick={onClick} style={{
      ...card, width: '100%', textAlign: 'left', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10,
      border: `1px solid ${challenge.color}33`,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: `${challenge.color}22`,
        border: `1.5px solid ${challenge.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
      }}>
        {challenge.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {challenge.name}
          </span>
          {isOwner && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: GOLD, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 6, padding: '2px 6px', flexShrink: 0 }}>
              ADMIN
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
          {challenge.duration} days · {challenge.memberCount} member{challenge.memberCount !== 1 ? 's' : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: challenge.color }}>{daysLeft}</div>
        <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>DAYS LEFT</div>
      </div>
    </button>
  );
}

// ─── CHALLENGE DETAIL ─────────────────────────────────────────────────────────
function ChallengeDetail({ challenge, onBack, onJoined }) {
  const { user } = useAuth();
  const [joined, setJoined]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [copied, setCopied]           = useState(false);
  const shareLink = `${window.location.origin}?join=${challenge.inviteCode}`;

  useEffect(() => {
    isMember(user.uid, challenge.id).then(setJoined);
  }, [challenge.id, user.uid]);

  const handleJoin = async () => {
    setLoading(true);
    await joinChallenge(user.uid, challenge.id);
    setJoined(true);
    onJoined?.();
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
        ← BACK
      </button>

      {/* Hero */}
      <div style={{
        borderRadius: 22, padding: '28px 24px', marginBottom: 20,
        background: `linear-gradient(135deg, ${challenge.color}22, ${challenge.color}08)`,
        border: `1px solid ${challenge.color}44`,
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{challenge.emoji}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: challenge.color, background: `${challenge.color}18`, border: `1px solid ${challenge.color}44`, borderRadius: 6, padding: '3px 8px' }}>
            {challenge.difficulty.toUpperCase()}
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#888', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px' }}>
            {challenge.duration} DAYS
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#888', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px' }}>
            👥 {challenge.memberCount} MEMBER{challenge.memberCount !== 1 ? 'S' : ''}
          </span>
        </div>
        <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
          {challenge.name}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>{challenge.tagline}</p>
        <p style={{ margin: '10px 0 0', fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
          {challenge.startDate} → {challenge.endDate}
        </p>
      </div>

      {/* Rules */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>THE RULES</p>
        <div style={{ ...card, padding: '6px 18px' }}>
          {challenge.rules.map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < challenge.rules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ color: challenge.color, fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                {i + 1}.
              </span>
              <span style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily tasks */}
      {challenge.tasks?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>DAILY TASKS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {challenge.tasks.map(task => (
              <div key={task.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <span style={{ fontSize: 20 }}>{task.emoji}</span>
                <span style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>{task.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setDisclaimerOpen(o => !o)} style={{
          width: '100%', ...card, cursor: 'pointer', border: '1px solid rgba(255,165,0,0.2)',
          background: 'rgba(255,165,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#FFA500', fontFamily: 'monospace' }}>DISCLAIMER & HEALTH NOTICE</span>
          </div>
          <span style={{ color: '#555', fontSize: 16, transform: disclaimerOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
        </button>
        {disclaimerOpen && (
          <div style={{ ...card, marginTop: 4, border: '1px solid rgba(255,165,0,0.15)', background: 'rgba(255,165,0,0.04)', borderRadius: '0 0 14px 14px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.7, fontFamily: 'monospace' }}>
              {challenge.disclaimer}
            </p>
          </div>
        )}
      </div>

      {/* Share link */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>INVITE LINK</p>
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 1, fontSize: 11, color: '#666', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shareLink}
          </span>
          <button onClick={handleCopy} style={{
            background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? '#34D399' : 'rgba(255,255,255,0.1)'}`,
            color: copied ? '#34D399' : '#888', borderRadius: 8,
            padding: '6px 12px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer', flexShrink: 0, transition: 'all .2s',
          }}>
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>
      </div>

      {/* Join / joined CTA */}
      {joined === null ? null : joined ? (
        <div style={{ ...card, textAlign: 'center', border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.06)' }}>
          <span style={{ fontSize: 22 }}>✅</span>
          <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 700, color: '#34D399' }}>You're in this challenge!</p>
        </div>
      ) : (
        <button onClick={handleJoin} disabled={loading} style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${challenge.color}, ${challenge.color}aa)`,
          color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
          boxShadow: `0 4px 20px ${challenge.color}55`, opacity: loading ? 0.7 : 1,
        }}>
          {loading ? '…' : `${challenge.emoji} Join Challenge`}
        </button>
      )}
    </div>
  );
}

// ─── CREATE CHALLENGE FLOW ────────────────────────────────────────────────────
function CreateChallenge({ onBack, onCreate }) {
  const { user }                    = useAuth();
  const [step, setStep]             = useState(1);
  const [template, setTemplate]     = useState(null);
  const [customName, setCustomName] = useState('');
  const [startDate, setStartDate]   = useState(todayStr());
  const [loading, setLoading]       = useState(false);
  const [created, setCreated]       = useState(null);
  const [copied, setCopied]         = useState(false);

  const shareLink = created ? `${window.location.origin}?join=${created.inviteCode}` : '';

  const handleCreate = async () => {
    setLoading(true);
    const c = await createChallenge(user.uid, template, customName, startDate);
    setCreated(c);
    setStep(3);
    onCreate?.();
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button onClick={step === 1 ? onBack : () => setStep(s => s - 1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
        ← {step === 1 ? 'BACK' : 'PREVIOUS'}
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= step ? `linear-gradient(90deg, ${ACCENT}, ${GOLD})` : 'rgba(255,255,255,0.07)', transition: 'background .3s' }} />
        ))}
      </div>

      {/* Step 1 — pick template */}
      {step === 1 && (
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
            Choose a challenge
          </h2>
          <p style={{ color: '#555', fontSize: 13, margin: '0 0 24px' }}>Pick a template or design your own</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CHALLENGE_TEMPLATES.map(t => (
              <button key={t.id} onClick={() => { setTemplate(t); setCustomName(t.name); setStep(2); }} style={{
                ...card, cursor: 'pointer', textAlign: 'left',
                border: `1px solid ${t.color}44`,
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
                transition: 'all .2s',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${t.color}18`, border: `1.5px solid ${t.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {t.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.name}</span>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: t.color, background: `${t.color}15`, border: `1px solid ${t.color}33`, borderRadius: 5, padding: '2px 6px' }}>
                      {t.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#666' }}>{t.tagline}</div>
                </div>
                <div style={{ fontSize: 12, color: '#555', fontFamily: 'monospace', flexShrink: 0 }}>
                  {t.duration}d →
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — customise + rules + disclaimer */}
      {step === 2 && template && (
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
            Customise
          </h2>
          <p style={{ color: '#555', fontSize: 13, margin: '0 0 22px' }}>Name your challenge and set the start date</p>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>CHALLENGE NAME</label>
            <input value={customName} onChange={e => setCustomName(e.target.value)} style={{
              width: '100%', padding: '13px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
              boxSizing: 'border-box', outline: 'none',
            }} />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>START DATE</label>
            <input type="date" value={startDate} min={todayStr()} onChange={e => setStartDate(e.target.value)} style={{
              width: '100%', padding: '13px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
              boxSizing: 'border-box', outline: 'none', colorScheme: 'dark',
            }} />
          </div>

          {template.rules.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>RULES YOUR MEMBERS WILL SEE</p>
              <div style={{ ...card, padding: '6px 18px' }}>
                {template.rules.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < template.rules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'flex-start' }}>
                    <span style={{ color: template.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ ...card, marginBottom: 22, border: '1px solid rgba(255,165,0,0.2)', background: 'rgba(255,165,0,0.05)', padding: '14px 18px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 11, color: '#888', lineHeight: 1.6, fontFamily: 'monospace' }}>
                {template.disclaimer}
              </p>
            </div>
          </div>

          <button onClick={handleCreate} disabled={loading || !customName.trim()} style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: customName.trim() ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})` : 'rgba(255,255,255,0.06)',
            color: customName.trim() ? '#000' : '#444', fontSize: 15, fontWeight: 800,
            cursor: customName.trim() ? 'pointer' : 'default',
            fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
            boxShadow: customName.trim() ? `0 4px 20px rgba(255,107,53,0.35)` : 'none',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? '…' : `Create ${template.emoji} Challenge`}
          </button>
        </div>
      )}

      {/* Step 3 — success */}
      {step === 3 && created && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 8px' }}>CHALLENGE CREATED</p>
          <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
            {created.name} is live!
          </h2>
          <p style={{ color: '#555', fontSize: 13, margin: '0 0 32px' }}>
            Share the link below to invite your tribe
          </p>

          <div style={{ ...card, textAlign: 'left', marginBottom: 16 }}>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>YOUR INVITE LINK</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ flex: 1, fontSize: 11, color: '#666', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {shareLink}
              </span>
              <button onClick={handleCopy} style={{
                background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${copied ? '#34D399' : 'rgba(255,255,255,0.1)'}`,
                color: copied ? '#34D399' : '#888', borderRadius: 8,
                padding: '6px 12px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
                cursor: 'pointer', flexShrink: 0, transition: 'all .2s',
              }}>
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {['WhatsApp', 'Instagram', 'Messages'].map(app => (
              <button key={app} onClick={() => navigator.clipboard.writeText(shareLink).catch(() => {})} style={{
                flex: 1, padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#666', fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              }}>
                {app}
              </button>
            ))}
          </div>

          <button onClick={onBack} style={{
            marginTop: 20, width: '100%', padding: '14px', borderRadius: 14, border: 'none',
            background: `linear-gradient(135deg, ${ACCENT}, ${GOLD})`,
            color: '#000', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            fontFamily: "'Syne', sans-serif",
          }}>
            View My Challenges
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN CHALLENGES TAB ──────────────────────────────────────────────────────
export default function ChallengesTab({ pendingJoinCode, onJoinHandled }) {
  const { user }                              = useAuth();
  const [view, setView]                       = useState('list');
  const [myChallenges, setMyChallenges]       = useState([]);
  const [joinedIds, setJoinedIds]             = useState(new Set());
  const [detailChallenge, setDetailChallenge] = useState(null);
  const [trackerChallenge, setTrackerChallenge] = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [pendingChallenge, setPendingChallenge] = useState(null);

  const load = async () => {
    const { getUserProfile } = await import('./userService');
    const p = await getUserProfile(user.uid);
    const ids = p?.joinedChallengeIds || [];
    const challenges = await getUserChallenges(ids);
    setMyChallenges(challenges);
    setJoinedIds(new Set(ids));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.uid]);

  // Handle invite link
  useEffect(() => {
    if (!pendingJoinCode) return;
    getChallengeByInviteCode(pendingJoinCode).then(c => {
      if (c) { setPendingChallenge(c); setDetailChallenge(c); setView(joinedIds.has(c.id) ? 'tracker' : 'detail'); if (joinedIds.has(c.id)) setTrackerChallenge(c); }
      onJoinHandled?.();
      window.history.replaceState({}, '', window.location.pathname);
    });
  }, [pendingJoinCode]);

  const openChallenge = async (challengeId) => {
    const c = await getChallenge(challengeId);
    if (!c) return;
    if (joinedIds.has(challengeId)) {
      setTrackerChallenge(c); setView('tracker');
    } else {
      setDetailChallenge(c); setView('detail');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <span style={{ fontSize: 28 }}>🔥</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '52px 20px 20px', fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {view === 'list' && (
        <div>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, margin: '0 0 6px', fontFamily: 'monospace' }}>YOUR TRIBE</p>
          <h2 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
            Challenges 🎯
          </h2>

          {/* Create CTA */}
          <button onClick={() => setView('create')} style={{
            width: '100%', padding: '16px', borderRadius: 18, border: 'none',
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${GOLD} 100%)`,
            color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
            fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
            boxShadow: `0 4px 24px rgba(255,107,53,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 20 }}>＋</span> Start a Challenge
          </button>

          {/* My challenges */}
          {myChallenges.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 6px' }}>No challenges yet</p>
              <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
                Create one or ask a friend to share their invite link
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 12px' }}>
                MY CHALLENGES ({myChallenges.length})
              </p>
              {myChallenges.map(c => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  isOwner={c.createdBy === user.uid}
                  onClick={() => openChallenge(c.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'create' && (
        <CreateChallenge
          onBack={() => { setView('list'); load(); }}
          onCreate={load}
        />
      )}

      {view === 'detail' && detailChallenge && (
        <ChallengeDetail
          challenge={detailChallenge}
          onBack={() => { setView('list'); load(); }}
          onJoined={() => { load(); openChallenge(detailChallenge.id); }}
        />
      )}

      {view === 'tracker' && trackerChallenge && (
        <div style={{ padding: 0 }}>
          <ChallengeTrackerScreen
            challenge={trackerChallenge}
            onBack={() => { setView('list'); load(); }}
          />
        </div>
      )}
    </div>
  );
}

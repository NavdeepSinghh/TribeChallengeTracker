import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  CHALLENGE_TEMPLATES, createChallenge, joinChallenge,
  isMember, getChallenge, getChallengeByInviteCode, getUserChallenges,
  searchPublicChallenges,
} from './challengeService';
import ChallengeTrackerScreen from './ChallengeTrackerScreen';
import { canCreateChallengeTemplate, canUseProFeature, PRO_FEATURES } from './proFeatures';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';

const todayStr = () => new Date().toISOString().split('T')[0];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18, padding: 18,
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const wrapCanvasText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((canvasLine, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? '...' : '';
    ctx.fillText(`${canvasLine}${suffix}`, x, y + index * lineHeight);
  });
};

const campaignShareText = (challenge, shareLink) =>
  `Join my ${challenge.name} challenge on Rise With The Tribe.\n${challenge.campaignCta || 'Tag @risewiththetribe and bring your accountability partner.'}\n${challenge.campaignHashtag ? `${challenge.campaignHashtag} ` : ''}${shareLink}`;

const makeChallengeLaunchCardBlob = ({ challenge, shareLink }) => new Promise(resolve => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const accent = challenge.color || ACCENT;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#080808');
  gradient.addColorStop(0.55, '#14100d');
  gradient.addColorStop(1, '#08140f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `${accent}2a`;
  ctx.beginPath();
  ctx.arc(920, 240, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,215,0,0.12)';
  ctx.beginPath();
  ctx.arc(120, 1580, 340, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 72, 72, 936, 1776, 54);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('RISE WITH THE TRIBE', 540, 185);
  ctx.fillStyle = accent;
  ctx.font = '800 30px Arial';
  ctx.fillText('@risewiththetribe', 540, 235);

  ctx.font = '900 150px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(challenge.emoji || '🔥', 540, 430);

  ctx.fillStyle = challenge.campaignLabel ? accent : GOLD;
  ctx.font = '900 30px Arial';
  ctx.fillText((challenge.campaignLabel || 'CHALLENGE LAUNCH').toUpperCase(), 540, 535);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 82px Arial';
  wrapCanvasText(ctx, challenge.name, 540, 650, 820, 90, 2);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '700 34px Arial';
  wrapCanvasText(ctx, challenge.tagline, 540, 860, 820, 46, 2);

  const stats = [
    [`${challenge.duration || 0}`, 'DAYS'],
    [`${challenge.memberCount || 1}`, 'MEMBERS'],
    [challenge.difficulty?.toUpperCase?.() || 'OPEN', 'LEVEL'],
  ];
  stats.forEach(([value, label], index) => {
    const x = 120 + index * 300;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    drawRoundedRect(ctx, x, 1030, 260, 150, 24);
    ctx.fill();
    ctx.fillStyle = index === 0 ? accent : index === 1 ? GOLD : '#34D399';
    ctx.font = '900 46px Arial';
    ctx.fillText(value, x + 130, 1095);
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '900 22px Arial';
    ctx.fillText(label, x + 130, 1142);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  drawRoundedRect(ctx, 120, 1270, 840, 230, 30);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.font = '900 28px Arial';
  ctx.fillText(challenge.campaignHashtag || '#RiseWithTheTribe', 540, 1345);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 34px Arial';
  wrapCanvasText(ctx, challenge.campaignCta || 'Tag @risewiththetribe and bring your accountability partner.', 540, 1410, 730, 44, 2);

  ctx.fillStyle = accent;
  ctx.font = '900 34px Arial';
  ctx.fillText('JOIN CODE', 540, 1625);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 72px Arial';
  ctx.fillText(challenge.inviteCode || 'INVITE', 540, 1710);
  ctx.fillStyle = 'rgba(255,255,255,0.60)';
  ctx.font = '700 28px Arial';
  ctx.fillText(shareLink.replace(/^https?:\/\//, '').slice(0, 52), 540, 1785);

  canvas.toBlob(resolve, 'image/png', 0.94);
});

// ─── CHALLENGE CARD (list item) ───────────────────────────────────────────────
function ChallengeCard({ challenge, isOwner, onClick, alreadyJoined }) {
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
          {alreadyJoined && !isOwner && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 6, padding: '2px 6px', flexShrink: 0 }}>
              ✓ JOINED
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
            {challenge.duration} days · {challenge.memberCount} member{challenge.memberCount !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: challenge.isPublic ? '#34D399' : '#888', background: challenge.isPublic ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${challenge.isPublic ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 5, padding: '1px 5px' }}>
            {challenge.isPublic ? '🌐 PUBLIC' : '🔒 PRIVATE'}
          </span>
          {challenge.campaignLabel && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: challenge.color, background: `${challenge.color}12`, border: `1px solid ${challenge.color}33`, borderRadius: 5, padding: '1px 5px' }}>
              📣 {challenge.campaignLabel.toUpperCase()}
            </span>
          )}
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
function ChallengeDetail({ challenge, onBack, onJoined, pendingReferralUid = '' }) {
  const { user } = useAuth();
  const [joined, setJoined]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [copied, setCopied]           = useState(false);
  const [launchCardMessage, setLaunchCardMessage] = useState('');
  const shareLink = `${window.location.origin}?join=${challenge.inviteCode}&ref=${user.uid}`;

  useEffect(() => {
    isMember(user.uid, challenge.id).then(setJoined);
  }, [challenge.id, user.uid]);

  const handleJoin = async () => {
    setLoading(true);
    const referralUid = pendingReferralUid || sessionStorage.getItem('pendingReferralUid') || '';
    await joinChallenge(user.uid, challenge.id, referralUid);
    sessionStorage.removeItem('pendingReferralUid');
    setJoined(true);
    onJoined?.();
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchCardShare = async () => {
    const text = campaignShareText(challenge, shareLink);
    setLaunchCardMessage('Preparing launch card...');
    try {
      const blob = await makeChallengeLaunchCardBlob({ challenge, shareLink });
      const file = new File([blob], `${challenge.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-launch-card.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `${challenge.name} challenge`, text, files: [file] });
        setLaunchCardMessage('Launch card shared.');
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: `${challenge.name} challenge`, text });
        setLaunchCardMessage('Invite shared.');
        return;
      }
      await navigator.clipboard.writeText(text);
      setLaunchCardMessage('Campaign copy copied.');
    } catch (error) {
      console.error('[Challenge launch card]', error);
      setLaunchCardMessage('Could not share card. Invite copy copied instead.');
      navigator.clipboard.writeText(text).catch(() => {});
    }
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

      {challenge.dailyPrompts?.length > 0 && (
        <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.055)' }}>
          <p style={{ margin: '0 0 10px', fontSize: 10, color: '#A78BFA', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            PACK ACCOUNTABILITY PROMPTS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {challenge.dailyPrompts.map((prompt, index) => (
              <div key={`${prompt}-${index}`} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#A78BFA', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>{String(index + 1).padStart(2, '0')}</span>
                <p style={{ margin: 0, color: '#bbb', fontSize: 12, lineHeight: 1.45 }}>{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {challenge.campaignCta && (
        <div style={{ ...card, marginBottom: 16, border: `1px solid ${challenge.color}33`, background: `${challenge.color}0d` }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, color: challenge.color, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            INSTAGRAM CAMPAIGN {challenge.campaignHashtag ? `· ${challenge.campaignHashtag}` : ''}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#bbb', lineHeight: 1.5 }}>{challenge.campaignCta}</p>
        </div>
      )}

      {(challenge.creatorSpecialty || challenge.creatorBio) && (
        <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(167,139,250,0.28)', background: 'rgba(167,139,250,0.07)' }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, color: '#A78BFA', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            COACH HOST {challenge.creatorSpecialty ? `· ${challenge.creatorSpecialty}` : ''}
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#fff', fontWeight: 900 }}>
            {challenge.creatorName || 'Rise With The Tribe Creator'}
          </p>
          {challenge.creatorBio && (
            <p style={{ margin: 0, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{challenge.creatorBio}</p>
          )}
          {challenge.creatorCtaUrl && (
            <a
              href={challenge.creatorCtaUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 10, color: '#A78BFA', fontSize: 11, fontWeight: 900, textDecoration: 'none' }}
            >
              Creator link
            </a>
          )}
        </div>
      )}

      {challenge.sponsorName && (
        <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(96,165,250,0.28)', background: 'rgba(96,165,250,0.07)' }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, color: '#60A5FA', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            {challenge.sponsorLabel || 'PARTNER PERK'}
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#fff', fontWeight: 900 }}>{challenge.sponsorName}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{challenge.sponsorPerk}</p>
        </div>
      )}

      <div style={{ ...card, marginBottom: 16, border: `1px solid ${challenge.color}33` }}>
        <p style={{ margin: '0 0 6px', fontSize: 10, color: challenge.color, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
          LAUNCH CARD
        </p>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#888', lineHeight: 1.45 }}>
          Share a story-ready challenge card with the invite code, campaign CTA, and referral link.
        </p>
        <button onClick={handleLaunchCardShare} style={{
          width: '100%', border: 'none', borderRadius: 12,
          background: `linear-gradient(135deg, ${challenge.color}, ${GOLD})`,
          color: '#111', padding: '12px', fontSize: 12, fontWeight: 900,
          cursor: 'pointer', fontFamily: "'Syne', sans-serif",
        }}>
          Share Launch Card
        </button>
        {launchCardMessage && (
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            {launchCardMessage}
          </p>
        )}
      </div>

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
function CreateChallenge({ onBack, onCreate, profile }) {
  const { user }                    = useAuth();
  const [step, setStep]             = useState(1);
  const [template, setTemplate]     = useState(null);
  const [customName, setCustomName] = useState('');
  const [startDate, setStartDate]   = useState(todayStr());
  const [isPublic, setIsPublic]     = useState(true);
  const [loading, setLoading]       = useState(false);
  const [created, setCreated]       = useState(null);
  const [copied, setCopied]         = useState(false);
  const [proMessage, setProMessage] = useState('');
  const canCreatePrivate = canUseProFeature(profile, PRO_FEATURES.privateChallenges);

  const shareLink = created ? `${window.location.origin}?join=${created.inviteCode}&ref=${user.uid}` : '';
  const createdCampaignShareText = created ? campaignShareText(created, shareLink) : '';

  const handleCreate = async () => {
    setLoading(true);
    const effectiveIsPublic = canCreatePrivate ? isPublic : true;
    try {
      const c = await createChallenge(user.uid, template, customName, startDate, effectiveIsPublic);
      setCreated(c);
      setStep(3);
      onCreate?.();
    } catch (err) {
      setProMessage(err?.message || 'Could not create challenge.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreatedLaunchCardShare = async () => {
    if (!created) return;
    const text = campaignShareText(created, shareLink);
    try {
      const blob = await makeChallengeLaunchCardBlob({ challenge: created, shareLink });
      const file = new File([blob], `${created.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-launch-card.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `${created.name} challenge`, text, files: [file] });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: `${created.name} challenge`, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[Challenge launch card]', error);
      navigator.clipboard.writeText(text).catch(() => {});
    }
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
              <button key={t.id} onClick={() => {
                if (!canCreateChallengeTemplate(profile, t)) {
                  setProMessage('Premium challenge packs unlock with Tribe Pro or a pack purchase.');
                  return;
                }
                setProMessage('');
                setTemplate(t);
                setCustomName(t.name);
                setStep(2);
              }} style={{
                ...card, cursor: 'pointer', textAlign: 'left',
                border: `1px solid ${t.color}44`,
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
                transition: 'all .2s', opacity: !canCreateChallengeTemplate(profile, t) ? 0.72 : 1,
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
                    {t.isPremium && (
                      <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 900, color: '#A78BFA', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)', borderRadius: 5, padding: '2px 6px' }}>
                        {canCreateChallengeTemplate(profile, t) ? t.packLabel?.toUpperCase() || 'PREMIUM' : 'LOCKED'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#666' }}>{t.tagline}</div>
                  {t.campaignLabel && (
                    <div style={{ marginTop: 6, fontSize: 9, color: t.color, fontFamily: 'monospace', fontWeight: 800 }}>
                      📣 {t.campaignLabel.toUpperCase()} {t.campaignHashtag ? `· ${t.campaignHashtag}` : ''}
                    </div>
                  )}
                  {t.isPremium && (
                    <div style={{ marginTop: 10, padding: '9px 10px', borderRadius: 10, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                      <div style={{ color: '#A78BFA', fontSize: 9, fontFamily: 'monospace', fontWeight: 900, marginBottom: 6 }}>
                        PACK VALUE PREVIEW
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
                        {[
                          ['DAYS', t.duration],
                          ['TASKS', t.tasks?.length || 0],
                          ['PROMPTS', t.dailyPrompts?.length || 0],
                        ].map(([label, value]) => (
                          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 7px' }}>
                            <div style={{ color: '#777', fontSize: 8, fontFamily: 'monospace', fontWeight: 800 }}>{label}</div>
                            <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 7, color: '#888', fontSize: 10, lineHeight: 1.35 }}>
                        {canCreateChallengeTemplate(profile, t)
                          ? 'Unlocked for your account. Build the challenge and use the pack prompts every day.'
                          : 'Unlock with Tribe Pro or this pack to create the structured challenge.'}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#555', fontFamily: 'monospace', flexShrink: 0 }}>
                  {t.duration}d →
                </div>
              </button>
            ))}
          </div>
          {proMessage && (
            <p style={{ margin: '12px 0 0', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
              {proMessage}
            </p>
          )}
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

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>START DATE</label>
            <input type="date" value={startDate} min={todayStr()} onChange={e => setStartDate(e.target.value)} style={{
              width: '100%', padding: '13px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
              boxSizing: 'border-box', outline: 'none', colorScheme: 'dark',
            }} />
          </div>

          {/* Public / Private toggle */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>VISIBILITY</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { val: true,  icon: '🌐', label: 'Public', desc: 'Discoverable by anyone' },
                { val: false, icon: '🔒', label: 'Private', desc: canCreatePrivate ? 'Invite link only' : 'Tribe Pro benefit' },
              ].map(opt => (
                <button key={String(opt.val)} onClick={() => {
                  if (opt.val === false && !canCreatePrivate) {
                    setIsPublic(true);
                    setProMessage('Private challenges are a Tribe Pro feature. Public challenges are still available.');
                    return;
                  }
                  setProMessage('');
                  setIsPublic(opt.val);
                }} style={{
                  flex: 1, padding: '12px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                  border: `1.5px solid ${isPublic === opt.val ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                  background: isPublic === opt.val ? 'rgba(255,107,53,0.1)' : opt.val === false && !canCreatePrivate ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.03)',
                  transition: 'all .2s',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isPublic === opt.val ? '#fff' : '#666' }}>{opt.label}</div>
                  <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            {proMessage && (
              <p style={{ margin: '8px 0 0', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
                {proMessage}
              </p>
            )}
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

          {template.campaignCta && (
            <div style={{ ...card, marginBottom: 16, border: `1px solid ${template.color}33`, background: `${template.color}0d` }}>
              <p style={{ margin: '0 0 6px', fontSize: 10, color: template.color, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
                CAMPAIGN CTA {template.campaignHashtag ? `· ${template.campaignHashtag}` : ''}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{template.campaignCta}</p>
            </div>
          )}

          {template.sponsorName && (
            <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(96,165,250,0.28)', background: 'rgba(96,165,250,0.07)' }}>
              <p style={{ margin: '0 0 6px', fontSize: 10, color: '#60A5FA', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
                {template.sponsorLabel || 'PARTNER PERK'}
              </p>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#fff', fontWeight: 900 }}>{template.sponsorName}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{template.sponsorPerk}</p>
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

          <div style={{ ...card, textAlign: 'left', marginBottom: 16, border: `1px solid ${created.color}33`, background: `${created.color}0d` }}>
            <p style={{ color: created.color, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>CAMPAIGN COPY</p>
            <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{createdCampaignShareText}</p>
          </div>

          <button onClick={handleCreatedLaunchCardShare} style={{
            width: '100%', padding: '12px', borderRadius: 12, marginBottom: 12,
            border: `1px solid ${created.color}66`, background: `${created.color}18`,
            color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer',
            fontFamily: "'Syne', sans-serif",
          }}>
            Share Launch Card
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {['WhatsApp', 'Instagram', 'Messages'].map(app => (
              <button key={app} onClick={() => navigator.clipboard.writeText(createdCampaignShareText || shareLink).catch(() => {})} style={{
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
export default function ChallengesTab({ pendingJoinCode, pendingReferralUid, onJoinHandled, onStatsChanged }) {
  const { user }                              = useAuth();
  const [view, setView]                       = useState('list');
  const [myChallenges, setMyChallenges]       = useState([]);
  const [joinedIds, setJoinedIds]             = useState(new Set());
  const [detailChallenge, setDetailChallenge] = useState(null);
  const [trackerChallenge, setTrackerChallenge] = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchResults, setSearchResults]     = useState([]);
  const [searching, setSearching]             = useState(false);
  const [profile, setProfile]                 = useState(null);
  const searchTimer                           = useRef(null);

  const load = async () => {
    const { getUserProfile } = await import('./userService');
    const p = await getUserProfile(user.uid);
    setProfile(p);
    const ids = p?.joinedChallengeIds || [];
    const challenges = await getUserChallenges(ids);
    setMyChallenges(challenges);
    setJoinedIds(new Set(ids));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.uid]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults([]); setSearching(false); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const results = await searchPublicChallenges(q);
      // Keep all results; mark joined ones so the card can show it
      setSearchResults(results.map(c => ({ ...c, alreadyJoined: joinedIds.has(c.id) })));
      setSearching(false);
    }, 350);
  };

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
            <div style={{ ...card, textAlign: 'center', padding: '36px 24px', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 6px' }}>No challenges yet</p>
              <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
                Create one or search below to join a public challenge
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
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

          {/* Discover public challenges */}
          <div>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>
              DISCOVER CHALLENGES 🔍
            </p>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search public challenges…"
                style={{
                  width: '100%', padding: '12px 16px 12px 38px',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: '#fff',
                  fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
              {searching && (
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12 }}>⏳</span>
              )}
            </div>

            {searchQuery.trim() && !searching && searchResults.length === 0 && (
              <div style={{ ...card, textAlign: 'center', padding: '24px' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#555' }}>No public challenges found for "{searchQuery}"</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <p style={{ color: '#444', fontSize: 9, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, margin: '0 0 10px' }}>
                  {searchResults.length} RESULT{searchResults.length !== 1 ? 'S' : ''}
                </p>
                {searchResults.map(c => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    isOwner={c.createdBy === user.uid}
                    alreadyJoined={c.alreadyJoined}
                    onClick={() => { setDetailChallenge(c); setView(c.alreadyJoined ? 'tracker' : 'detail'); if (c.alreadyJoined) setTrackerChallenge(c); }}
                  />
                ))}
              </div>
            )}

            {!searchQuery.trim() && (
              <div style={{ ...card, padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#ccc' }}>Find your next challenge</p>
                <p style={{ margin: 0, fontSize: 12, color: '#555' }}>
                  Search by name to discover public challenges from the community. Private challenges require an invite link.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'create' && (
        <CreateChallenge
          profile={profile}
          onBack={() => { setView('list'); load(); }}
          onCreate={() => { load(); onStatsChanged?.(); }}
        />
      )}

      {view === 'detail' && detailChallenge && (
        <ChallengeDetail
          challenge={detailChallenge}
          onBack={() => { setView('list'); load(); }}
          onJoined={() => { load(); openChallenge(detailChallenge.id); onStatsChanged?.(); }}
          pendingReferralUid={pendingReferralUid}
        />
      )}

      {view === 'tracker' && trackerChallenge && (
        <div style={{ padding: 0 }}>
          <ChallengeTrackerScreen
            challenge={trackerChallenge}
            onBack={() => { setView('list'); load(); }}
            onLeft={() => { load(); onStatsChanged?.(); }}
          />
        </div>
      )}
    </div>
  );
}

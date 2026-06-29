import { useEffect, useState } from 'react';
import {
  FOLLOW_PROFILE_VISIBILITY,
  ROUTINE_VISIBILITY,
  saveFollowProfileSettings,
} from '../userServices/followService';

export default function ProfileFollowSettingsSection({ profile, theme, user }) {
  const [bio, setBio] = useState('');
  const [profileVisibility, setProfileVisibility] = useState(FOLLOW_PROFILE_VISIBILITY.PUBLIC);
  const [routineDefaultVisibility, setRoutineDefaultVisibility] = useState(ROUTINE_VISIBILITY.PRIVATE);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const followProfile = profile?.followProfile || {};
    setBio(followProfile.bio || '');
    setProfileVisibility(followProfile.profileVisibility || FOLLOW_PROFILE_VISIBILITY.PUBLIC);
    setRoutineDefaultVisibility(followProfile.routineDefaultVisibility || ROUTINE_VISIBILITY.PRIVATE);
  }, [profile?.followProfile]);

  async function handleSave() {
    if (!user?.uid) return;
    setIsSaving(true);
    setMessage('');
    try {
      await saveFollowProfileSettings(user.uid, {
        ...(profile || {}),
        displayName: profile?.displayName || user?.displayName || '',
        email: profile?.email || user?.email || '',
      }, {
        bio,
        profileVisibility,
        routineDefaultVisibility,
      });
      setMessage('Follow profile settings saved.');
    } catch (error) {
      setMessage(error.message || 'Could not save follow settings.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 18,
      padding: 18,
      marginBottom: 18,
    }}>
      <p style={{ margin: '0 0 6px', color: theme.mutedStrong, fontSize: 10, fontWeight: 900, letterSpacing: 1.6, fontFamily: 'monospace' }}>FOLLOW BETA</p>
      <h3 style={{ margin: '0 0 8px', color: theme.text, fontSize: 18, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>Public profile controls</h3>
      <p style={{ margin: '0 0 14px', color: theme.textSoft, fontSize: 12, lineHeight: 1.45 }}>
        Your profile is public by default for TestFlight discovery. New routines stay private unless you change the default.
      </p>

      <label style={labelStyle(theme)}>Bio shown on public/follower profiles</label>
      <textarea
        value={bio}
        onChange={event => setBio(event.target.value)}
        maxLength={160}
        placeholder="Example: Training for consistency, strength, and better mornings."
        style={textAreaStyle(theme)}
      />
      <div style={{ color: theme.mutedStrong, fontSize: 10, textAlign: 'right', marginBottom: 12 }}>{bio.length}/160</div>

      <label style={labelStyle(theme)}>Profile visibility</label>
      <select value={profileVisibility} onChange={event => setProfileVisibility(event.target.value)} style={selectStyle(theme)}>
        <option value={FOLLOW_PROFILE_VISIBILITY.PRIVATE}>Private</option>
        <option value={FOLLOW_PROFILE_VISIBILITY.FOLLOWERS}>Followers only</option>
        <option value={FOLLOW_PROFILE_VISIBILITY.PUBLIC}>Public</option>
      </select>

      <label style={labelStyle(theme)}>Default routine visibility</label>
      <select value={routineDefaultVisibility} onChange={event => setRoutineDefaultVisibility(event.target.value)} style={selectStyle(theme)}>
        <option value={ROUTINE_VISIBILITY.PRIVATE}>Private</option>
        <option value={ROUTINE_VISIBILITY.FOLLOWERS}>Followers only</option>
        <option value={ROUTINE_VISIBILITY.PUBLIC}>Public</option>
      </select>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        style={{
          width: '100%',
          marginTop: 12,
          border: 'none',
          borderRadius: 14,
          padding: '13px 14px',
          background: isSaving ? theme.cardBorder : 'linear-gradient(135deg, #FF6B35, #FFD700)',
          color: '#111',
          fontSize: 13,
          fontWeight: 900,
          cursor: isSaving ? 'not-allowed' : 'pointer',
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {isSaving ? 'Saving...' : 'Save follow settings'}
      </button>
      {message && <p style={{ margin: '10px 0 0', color: message.includes('Could not') ? '#EF4444' : '#34D399', fontSize: 12, fontWeight: 800 }}>{message}</p>}
    </section>
  );
}

function labelStyle(theme) {
  return {
    display: 'block',
    margin: '12px 0 6px',
    color: theme.mutedStrong,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  };
}

function textAreaStyle(theme) {
  return {
    width: '100%',
    minHeight: 82,
    boxSizing: 'border-box',
    resize: 'vertical',
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 14,
    padding: 12,
    background: theme.inputBg || theme.appBg,
    color: theme.text,
    fontSize: 14,
    outline: 'none',
  };
}

function selectStyle(theme) {
  return {
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 14,
    padding: 12,
    background: theme.inputBg || theme.appBg,
    color: theme.text,
    fontSize: 14,
    fontWeight: 800,
    outline: 'none',
  };
}

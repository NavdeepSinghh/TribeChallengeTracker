import { ACCENT } from './profileConstants';

export function ProfileAppearanceSavingSpinner() {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%',
      border: `2px solid ${ACCENT}55`, borderTopColor: ACCENT,
      animation: 'spin .8s linear infinite',
    }} />
  );
}

export function ProfileAppearanceError({ appearanceError }) {
  if (!appearanceError) return null;

  return (
    <div style={{
      margin: '-8px 0 18px', padding: '10px 12px',
      borderRadius: 12, border: '1px solid rgba(255,107,53,0.28)',
      background: 'rgba(255,107,53,0.08)', color: '#ffb199',
      fontSize: 12, fontWeight: 700,
    }}>
      {appearanceError}
    </div>
  );
}

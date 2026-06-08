import { ACCENT, GOLD } from './challengeTheme';

export default function CreateChallengeProgress({ step }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
      {[1, 2, 3].map(s => (
        <div
          key={s}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 3,
            background: s <= step ? `linear-gradient(90deg, ${ACCENT}, ${GOLD})` : 'rgba(255,255,255,0.07)',
            transition: 'background .3s',
          }}
        />
      ))}
    </div>
  );
}

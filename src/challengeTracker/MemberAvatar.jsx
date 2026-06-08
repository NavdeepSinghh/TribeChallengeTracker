import { fallbackAvatar } from './challengeTrackerTheme';

export default function MemberAvatar({ member, size = 38 }) {
  const color = member.avatarColor || 'rgba(255,255,255,0.12)';
  const image = member.profileImageData;
  const frame = {
    ember: ['#FF6B35', '#FFD700'],
    gold: ['#FFD700', '#F59E0B'],
    neon: ['#34D399', '#60A5FA'],
  }[member.profileFrameId];

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      background: `${color}22`, border: '1.5px solid transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.47), flexShrink: 0,
      boxShadow: frame ? `0 0 18px ${frame[0]}33` : undefined,
      backgroundImage: frame
        ? `linear-gradient(#111,#111), linear-gradient(135deg, ${frame[0]}, ${frame[1]})`
        : `linear-gradient(#111,#111), linear-gradient(135deg, ${color}55, ${color}55)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    }}>
      {image ? (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (member.avatarEmoji || fallbackAvatar(member.uid || 'x'))}
    </div>
  );
}

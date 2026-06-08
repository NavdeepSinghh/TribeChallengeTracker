export default function ProfileTopBar({ onClose }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
      padding: '48px 24px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>YOUR PROFILE</p>
      <button onClick={onClose} style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#888', borderRadius: 20, width: 32, height: 32,
        fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>×</button>
    </div>
  );
}

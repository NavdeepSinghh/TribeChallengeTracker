const WEB_APP_VERSION = '1.0.0';
const WEB_APP_BUILD = process.env.REACT_APP_BUILD_NUMBER || 'web';

export default function ProfileVersionFooter({ theme }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '10px 0 0',
      color: theme.mutedStrong,
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.8,
    }}>
      TribeLog · Version {WEB_APP_VERSION} · Build {WEB_APP_BUILD}
    </div>
  );
}

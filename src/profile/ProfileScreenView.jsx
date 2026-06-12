import ProfileMonetizationSections from './ProfileMonetizationSections';
import ProfileScreenGrowthSections from './ProfileScreenGrowthSections';
import ProfileScreenIdentityPanel from './ProfileScreenIdentityPanel';
import ProfileScreenSheets from './ProfileScreenSheets';
import ProfileScreenSupportSections from './ProfileScreenSupportSections';
import ProfileTopBar from './ProfileTopBar';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function ProfileScreenView({ model, mode = 'profile' }) {
  const { onClose, visible } = model;
  const isSettings = mode === 'settings';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: '#080808',
      overflowY: 'auto',
      maxWidth: 430, margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity .3s ease, transform .3s ease',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <ProfileTopBar onClose={onClose} />

      <div style={{ padding: '24px 24px 60px' }}>
        <ProfileScreenIdentityPanel model={model} />
        {isSettings ? (
          <>
            <ProfileScreenGrowthSections model={model} />
            {V1_PAID_FEATURES_ENABLED && (
              <>
                <ProfileMonetizationSections model={model} mode="commerce" />
                <ProfileMonetizationSections model={model} mode="prelaunch" />
              </>
            )}
            <ProfileScreenSupportSections model={model} />
          </>
        ) : (
          <ProfileScreenGrowthSections model={model} mode="profile" />
        )}
      </div>

      <ProfileScreenSheets model={model} />
    </div>
  );
}

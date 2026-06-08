import { card } from './challengeTheme';

export default function ChallengeDetailPromoCards({ challenge }) {
  return (
    <>
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
    </>
  );
}

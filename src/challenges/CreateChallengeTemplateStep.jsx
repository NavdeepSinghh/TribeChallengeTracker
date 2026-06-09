import { CHALLENGE_TEMPLATES } from '../challengeService';
import CreateChallengeTemplateCard from './CreateChallengeTemplateCard';

export default function CreateChallengeTemplateStep({
  onTemplateSelect,
  publishedCreatorTemplateMessage,
  publishedCreatorTemplates = [],
  proMessage,
  profile,
}) {
  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
        Choose a challenge
      </h2>
      <p style={{ color: '#555', fontSize: 13, margin: '0 0 24px' }}>Pick a template or design your own</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CHALLENGE_TEMPLATES.map(t => (
          <CreateChallengeTemplateCard
            key={t.id}
            onTemplateSelect={onTemplateSelect}
            profile={profile}
            template={t}
          />
        ))}
      </div>
      {(publishedCreatorTemplates.length > 0 || publishedCreatorTemplateMessage) && (
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>
                PUBLISHED CREATOR TEMPLATES
              </div>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 11, lineHeight: 1.35 }}>
                Free-first, admin-reviewed creator-led templates from creatorChallengeTemplates.
              </p>
            </div>
            <span style={{ color: '#34D399', fontSize: 9, fontFamily: 'monospace', fontWeight: 900 }}>
              {publishedCreatorTemplates.length} LIVE
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {publishedCreatorTemplates.map(t => (
              <CreateChallengeTemplateCard
                key={t.id}
                onTemplateSelect={onTemplateSelect}
                profile={profile}
                template={t}
              />
            ))}
          </div>
          {publishedCreatorTemplateMessage && (
            <p style={{ margin: '10px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
              {publishedCreatorTemplateMessage}
            </p>
          )}
        </div>
      )}
      {proMessage && (
        <p style={{ margin: '12px 0 0', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
          {proMessage}
        </p>
      )}
    </div>
  );
}

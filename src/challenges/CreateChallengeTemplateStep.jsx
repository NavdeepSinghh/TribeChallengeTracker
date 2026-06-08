import { CHALLENGE_TEMPLATES } from '../challengeService';
import CreateChallengeTemplateCard from './CreateChallengeTemplateCard';

export default function CreateChallengeTemplateStep({
  onTemplateSelect,
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
      {proMessage && (
        <p style={{ margin: '12px 0 0', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
          {proMessage}
        </p>
      )}
    </div>
  );
}

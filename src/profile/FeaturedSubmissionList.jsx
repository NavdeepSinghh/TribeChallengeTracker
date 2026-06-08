import FeaturedSubmissionCard from './FeaturedSubmissionCard';

export default function FeaturedSubmissionList({ featuredSubmissions }) {
  if (!featuredSubmissions.length) {
    return (
      <p style={{ margin: 0, color: '#777', fontSize: 11, lineHeight: 1.45 }}>
        No featured wins yet. Submit your story below and help us build the highlight wall.
      </p>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {featuredSubmissions.slice(0, 4).map(sub => (
        <FeaturedSubmissionCard key={sub.id} submission={sub} />
      ))}
    </div>
  );
}

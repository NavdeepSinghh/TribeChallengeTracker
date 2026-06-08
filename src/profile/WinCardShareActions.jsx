import { GOLD } from './profileConstants';

export default function WinCardShareActions({
  handleMonthlyRecapShare,
  handleWeeklyRecapShare,
  handleWinCardShare,
  proActive,
}) {
  return (
    <>
      <button
        onClick={handleWinCardShare}
        style={{
          marginTop: 12, width: '100%', border: 'none', borderRadius: 12, padding: '12px 10px',
          background: GOLD, color: '#111', fontSize: 12, fontWeight: 900, cursor: 'pointer',
        }}
      >
        Create Share Card
      </button>
      <button
        onClick={handleWeeklyRecapShare}
        style={{
          marginTop: 8, width: '100%', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '11px 10px',
          background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer',
        }}
      >
        Share 7-Day Recap
      </button>
      <button
        onClick={handleMonthlyRecapShare}
        style={{
          marginTop: 8, width: '100%', border: '1px solid rgba(167,139,250,0.18)', borderRadius: 12, padding: '11px 10px',
          background: proActive ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)',
          color: proActive ? '#fff' : '#777', fontSize: 12, fontWeight: 900,
          cursor: proActive ? 'pointer' : 'not-allowed',
        }}
        disabled={!proActive}
      >
        {proActive ? 'Share 30-Day Recap' : '30-Day Recap with Pro'}
      </button>
    </>
  );
}

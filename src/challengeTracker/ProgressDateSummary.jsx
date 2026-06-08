export default function ProgressDateSummary({
  challenge,
  dayNum,
  daysLeft,
  endDate,
  fmtDate,
  pctDone,
  startDate,
}) {
  return (
    <div style={{
      marginBottom: 20, padding: '14px 16px', borderRadius: 14,
      background: `${challenge.color}0d`, border: `1px solid ${challenge.color}33`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>STARTED</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#ccc' }}>{fmtDate(startDate)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 2px', fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>TODAY</p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: challenge.color }}>
            DAY {dayNum}
          </p>
          <p style={{ margin: '1px 0 0', fontSize: 9, color: '#555', fontFamily: 'monospace' }}>OF {challenge.duration}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 2px', fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>ENDS</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#ccc' }}>{fmtDate(endDate)}</p>
        </div>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${pctDone}%`,
          background: `linear-gradient(90deg, ${challenge.color}88, ${challenge.color})`,
          boxShadow: `0 0 8px ${challenge.color}66`,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 9, color: '#555', fontFamily: 'monospace', textAlign: 'right' }}>
        {daysLeft === 0 ? 'CHALLENGE ENDS TODAY' : `${daysLeft} DAYS REMAINING`}
      </p>
    </div>
  );
}

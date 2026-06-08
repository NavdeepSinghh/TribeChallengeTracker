export default function FeatureSubmissionMediaField({
  featureFileInputRef,
  featureMediaData,
  handleFeatureMediaUpload,
  setFeatureMediaData,
}) {
  return (
    <>
      <input
        id={featureFileInputRef.current}
        type="file"
        accept="image/*"
        onChange={handleFeatureMediaUpload}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
        <label
          htmlFor={featureFileInputRef.current}
          style={{
            flex: 1, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.05)', color: '#ddd', padding: '10px 12px',
            fontSize: 11, fontWeight: 900, cursor: 'pointer', textAlign: 'center',
          }}
        >
          {featureMediaData ? 'Replace Photo' : 'Attach Photo'}
        </label>
        {featureMediaData && (
          <button
            onClick={() => setFeatureMediaData('')}
            style={{
              border: 'none', borderRadius: 12, background: 'rgba(255,255,255,0.06)',
              color: '#aaa', padding: '10px 12px', fontSize: 11, fontWeight: 900,
            }}
          >
            Remove
          </button>
        )}
      </div>
      {featureMediaData && (
        <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <img src={`data:image/jpeg;base64,${featureMediaData}`} alt="Feature submission preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }} />
        </div>
      )}
    </>
  );
}

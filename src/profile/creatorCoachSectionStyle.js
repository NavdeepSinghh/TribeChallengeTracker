export function buildCreatorCoachSectionStyle(proActive) {
  return {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    background: proActive ? 'rgba(96,165,250,0.07)' : 'rgba(255,255,255,0.025)',
    border: `1px solid ${proActive ? 'rgba(96,165,250,0.24)' : 'rgba(255,255,255,0.06)'}`,
    opacity: proActive ? 1 : 0.82,
  };
}

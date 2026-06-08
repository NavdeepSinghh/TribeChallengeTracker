import { resizeImageToBase64 } from './profileMedia';

export function buildFeatureMediaActionHandlers({
  setFeatureMediaData,
  setFeatureMessage,
}) {
  const handleFeatureMediaUpload = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFeatureMessage('');
    try {
      const mediaImageData = await resizeImageToBase64(file, 720, 0.7);
      if (mediaImageData.length > 900000) {
        throw new Error('Feature image is too large. Try a smaller photo.');
      }
      setFeatureMediaData(mediaImageData);
    } catch (err) {
      setFeatureMessage(err?.message || 'Could not attach that image.');
    }
  };

  return { handleFeatureMediaUpload };
}

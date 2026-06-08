import { renderWinCardCanvas } from './winCardCanvas';

export async function resizeImageToBase64(file, maxDimension = 384, quality = 0.68) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  let currentQuality = quality;
  let base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  while (base64.length > 700000 && currentQuality > 0.35) {
    currentQuality -= 0.1;
    base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  }
  return base64;
}

export const makeWinCardBlob = ({ displayName, totalPoints, streak, daysActive, rank, referralJoins, instagramHandle }) => new Promise(resolve => {
  const canvas = renderWinCardCanvas({
    displayName,
    totalPoints,
    streak,
    daysActive,
    rank,
    referralJoins,
    instagramHandle,
  });
  canvas.toBlob(resolve, 'image/png', 0.94);
});

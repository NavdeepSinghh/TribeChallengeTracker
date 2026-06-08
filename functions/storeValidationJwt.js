const crypto = require('crypto');

function createJwt({ header, payload, privateKey, algorithm, dsaEncoding }) {
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const signature = crypto.sign(algorithm, Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding,
  });
  return `${signingInput}.${base64Url(signature)}`;
}

function decodeJwtPayload(jwt) {
  if (!jwt) return {};
  const [, payload] = jwt.split('.');
  if (!payload) return {};
  return JSON.parse(Buffer.from(base64UrlToBase64(payload), 'base64').toString('utf8'));
}

function base64UrlJson(value) {
  return base64Url(Buffer.from(JSON.stringify(value)));
}

function base64Url(value) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBase64(value) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  return padded.replace(/-/g, '+').replace(/_/g, '/');
}

module.exports = {
  createJwt,
  decodeJwtPayload,
};

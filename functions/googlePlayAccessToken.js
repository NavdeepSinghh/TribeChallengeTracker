const { readJsonResponse } = require('./storeValidationHttp');
const { createJwt } = require('./storeValidationJwt');

async function getGoogleAccessToken(env) {
  const credentials = JSON.parse(env.PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const assertion = createJwt({
    header: { alg: 'RS256', typ: 'JWT' },
    payload: {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    },
    privateKey: credentials.private_key,
    algorithm: 'RSA-SHA256',
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });
  const body = await readJsonResponse(response);
  if (!response.ok || !body.access_token) {
    throw new Error(body.error_description || body.error || 'Unable to get Google Play access token.');
  }
  return body.access_token;
}

module.exports = {
  getGoogleAccessToken,
};

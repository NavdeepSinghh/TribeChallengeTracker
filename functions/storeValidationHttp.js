async function readJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
}

function validationFailure(status, body, httpStatus) {
  return {
    verified: false,
    status,
    message: body.error_description || body.error?.message || body.error || `Store validation failed with HTTP ${httpStatus}.`,
  };
}

module.exports = {
  readJsonResponse,
  validationFailure,
};

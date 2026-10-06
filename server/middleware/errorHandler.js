/**
 * Global error handler middleware.
 * Catches errors thrown by route handlers and returns a safe JSON response.
 */
function errorHandler(err, req, res, _next) {
  // Log the error server-side (never log raw secrets)
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  let status = err.status || 500;
  let message = 'Something went wrong while contacting the AI. Please try again.';

  if (/api[ _-]?key/i.test(err.message) || err.message?.includes('API_KEY_INVALID')) {
    status = 503;
    message = 'AI service is not configured properly. Please check that your GEMINI_API_KEY in Vercel environment variables is valid.';
  } else if (err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('429')) {
    status = 429;
    message = 'Google AI rate limit reached. Please wait a few moments and try again.';
  } else if (err.message?.includes('PERMISSION_DENIED') || err.message?.includes('403')) {
    status = 403;
    message = 'Access denied by Google AI. Please check that your API key is active in Google AI Studio.';
  } else if (err.message?.includes('INVALID_ARGUMENT')) {
    status = 400;
    message = 'The question could not be processed. Please try rephrasing.';
  } else if (err.message?.includes('not found') || err.message?.includes('404')) {
    status = 404;
    message = 'The AI model is not accessible with this API key. Please check Google AI Studio model permissions.';
  } else if (err.message?.includes('Only JPEG')) {
    status = 400;
    message = err.message;
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;

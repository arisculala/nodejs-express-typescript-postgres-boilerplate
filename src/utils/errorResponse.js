function sendError(
  res,
  statusCode = 500,
  message = 'An unexpected error occurred'
) {
  return res.status(statusCode).json({ message });
}

module.exports = {
  sendError,
};

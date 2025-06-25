function errorHandler(err, req, res, next) {
  console.error('[UNHANDLED ERROR]', err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({ message });
}

module.exports = errorHandler;

const { sendError } = require('./errorResponse');

function getXUserId(req, res) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    sendError(res, 400, 'Missing x-user-id header');
    return null;
  }
  return userId;
}

module.exports = { getXUserId };

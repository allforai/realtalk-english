const DELAY_MS = parseInt(process.env.MOCK_DELAY || '0', 10);

module.exports = (req, res, next) => {
  if (DELAY_MS > 0) {
    setTimeout(next, DELAY_MS);
  } else {
    next();
  }
};

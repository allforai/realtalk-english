const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

const IMAGE_MAP_PATH = path.join(__dirname, '..', 'fixtures', 'image-map.json');

module.exports = (req, res) => {
  const imageId = req.params[0] || req.path.replace('/', '');

  if (!fs.existsSync(IMAGE_MAP_PATH)) {
    return res.status(404).json({ error: 'image-map.json not found' });
  }

  const imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_PATH, 'utf-8'));
  const url = imageMap[imageId];
  if (!url) return res.status(404).json({ error: `Image ${imageId} not found` });

  const client = url.startsWith('https') ? https : http;
  client
    .get(url, (proxyRes) => {
      res.set('Content-Type', proxyRes.headers['content-type'] || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      proxyRes.pipe(res);
    })
    .on('error', () => {
      res.status(502).json({ error: 'Failed to proxy image' });
    });
};

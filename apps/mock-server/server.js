const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.MOCK_PORT || 4000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Simulated delay (optional)
const DELAY_MS = parseInt(process.env.MOCK_DELAY || '0', 10);
if (DELAY_MS > 0) {
  app.use((req, res, next) => setTimeout(next, DELAY_MS));
}

// --- Image Proxy ---
const imageProxy = require('./middleware/image-proxy');
app.use('/api/images', imageProxy);

// --- Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Route Loading ---
const routes = require('./routes.json');

for (const route of routes) {
  const handler = createHandler(route);
  app[route.method.toLowerCase()](route.path, handler);
}

function createHandler(route) {
  return (req, res) => {
    if (route.fixture) {
      const data = loadFixture(route.fixture);
      if (!data) return res.status(500).json({ error: 'Fixture not found' });

      // Pagination support
      if (route.paginated && req.query.page) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit || req.query.size) || 20;
        const start = (page - 1) * limit;
        const items = Array.isArray(data) ? data : data.items || [];
        return res.json({
          data: items.slice(start, start + limit),
          total: items.length,
          page,
          size: limit,
          total_pages: Math.ceil(items.length / limit),
        });
      }

      // ID lookup
      if (req.params.id && Array.isArray(data)) {
        const item = data.find((d) => String(d.id) === String(req.params.id));
        if (!item) return res.status(404).json({ code: 'NOT_FOUND', message: 'Not found' });
        return res.json({ data: item });
      }

      return res.json({ data });
    }

    // Static response
    if (route.response) {
      return res.status(route.status || 200).json(route.response);
    }

    // Write operations: echo request body
    if (['POST', 'PUT', 'PATCH'].includes(route.method)) {
      return res.status(route.status || 201).json({
        data: {
          ...req.body,
          id: req.params.id || generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }

    // DELETE
    if (route.method === 'DELETE') {
      return res.status(204).send();
    }

    res.status(200).json({ message: 'OK' });
  };
}

function loadFixture(name) {
  const filePath = path.join(__dirname, 'fixtures', `${name}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function generateId() {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// --- Auth Endpoints ---
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadFixture('users') || [];
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ code: 'AUTH_001', message: 'Invalid credentials' });
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: user.id, roles: user.roles || ['R001'], email: user.email },
    process.env.JWT_SECRET || 'mock-secret',
    { expiresIn: '24h' }
  );
  res.json({
    data: {
      access_token: token,
      refresh_token: token,
      expires_in: 86400,
      token_type: 'bearer',
      user: { id: user.id, display_name: user.display_name, email: user.email, roles: user.roles },
    },
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const id = generateId();
  res.status(201).json({
    data: {
      access_token: 'mock-token-' + id,
      refresh_token: 'mock-refresh-' + id,
      expires_in: 86400,
      token_type: 'bearer',
    },
  });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  res.json({
    data: {
      access_token: 'mock-refreshed-token',
      refresh_token: 'mock-refreshed-refresh',
      expires_in: 86400,
      token_type: 'bearer',
    },
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.status(204).send();
});

app.get('/api/v1/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ code: 'AUTH_002', message: 'No token' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(
      authHeader.replace('Bearer ', ''),
      process.env.JWT_SECRET || 'mock-secret'
    );
    const users = loadFixture('users') || [];
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ code: 'USER_002', message: 'User not found' });
    res.json({ data: user });
  } catch {
    res.status(401).json({ code: 'AUTH_002', message: 'Invalid token' });
  }
});

// --- Health Check ---
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// --- Start ---
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
  console.log(`Routes loaded: ${routes.length}`);
  console.log(`Fixtures dir: ${path.join(__dirname, 'fixtures')}`);
});

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logger ───────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ── In-Memory Data ────────────────────────────────────────────
const users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '2', name: 'Bob Smith',     email: 'bob@example.com',   role: 'user',  createdAt: '2026-01-05T00:00:00.000Z' },
  { id: '3', name: 'Carol White',   email: 'carol@example.com', role: 'user',  createdAt: '2026-01-10T00:00:00.000Z' },
];

const products = [
  { id: '1', name: 'Laptop Pro',     category: 'Electronics', price: 1299.99, stock: 25,  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '2', name: 'Wireless Mouse', category: 'Electronics', price: 29.99,   stock: 100, createdAt: '2026-01-03T00:00:00.000Z' },
  { id: '3', name: 'Standing Desk',  category: 'Furniture',   price: 499.99,  stock: 15,  createdAt: '2026-01-07T00:00:00.000Z' },
  { id: '4', name: 'Coffee Maker',   category: 'Kitchen',     price: 79.99,   stock: 50,  createdAt: '2026-01-09T00:00:00.000Z' },
];

// ── Error Helper ──────────────────────────────────────────────
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ── User Routes ───────────────────────────────────────────────
app.get('/api/users', (req, res) => {
  const { name } = req.query;
  const result = name
    ? users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()))
    : users;
  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/users/:id', (req, res, next) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return next(createError(`User with id '${req.params.id}' not found`, 404));
  res.json({ success: true, data: user });
});

app.post('/api/users', (req, res, next) => {
  const { name, email, role } = req.body;
  if (!name || !email) return next(createError('Fields "name" and "email" are required', 400));
  if (users.find(u => u.email === email)) return next(createError(`Email '${email}' is already in use`, 409));
  const newUser = { id: uuidv4(), name, email, role: role || 'user', createdAt: new Date().toISOString() };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

app.put('/api/users/:id', (req, res, next) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return next(createError(`User with id '${req.params.id}' not found`, 404));
  const { name, email, role } = req.body;
  if (email && email !== users[index].email && users.find(u => u.email === email))
    return next(createError(`Email '${email}' is already in use`, 409));
  users[index] = { ...users[index], ...(name && { name }), ...(email && { email }), ...(role && { role }) };
  res.json({ success: true, data: users[index] });
});

app.delete('/api/users/:id', (req, res, next) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return next(createError(`User with id '${req.params.id}' not found`, 404));
  const deleted = users.splice(index, 1)[0];
  res.json({ success: true, message: `User '${deleted.name}' deleted successfully` });
});

// ── Product Routes ────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const { category, name } = req.query;
  let result = products;
  if (category) result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (name)     result = result.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(createError(`Product with id '${req.params.id}' not found`, 404));
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res, next) => {
  const { name, category, price, stock } = req.body;
  if (!name || !category || price === undefined) return next(createError('Fields "name", "category", and "price" are required', 400));
  if (isNaN(price) || price < 0) return next(createError('"price" must be a non-negative number', 400));
  const newProduct = { id: uuidv4(), name, category, price: parseFloat(price), stock: stock !== undefined ? parseInt(stock) : 0, createdAt: new Date().toISOString() };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(createError(`Product with id '${req.params.id}' not found`, 404));
  const { name, category, price, stock } = req.body;
  if (price !== undefined && (isNaN(price) || price < 0)) return next(createError('"price" must be a non-negative number', 400));
  products[index] = {
    ...products[index],
    ...(name     !== undefined && { name }),
    ...(category !== undefined && { category }),
    ...(price    !== undefined && { price: parseFloat(price) }),
    ...(stock    !== undefined && { stock: parseInt(stock) }),
  };
  res.json({ success: true, data: products[index] });
});

app.delete('/api/products/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(createError(`Product with id '${req.params.id}' not found`, 404));
  const deleted = products.splice(index, 1)[0];
  res.json({ success: true, message: `Product '${deleted.name}' deleted successfully` });
});

// ── Root ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Assignment2 DevOps API is running!',
    version: '1.0.0',
    endpoints: { users: '/api/users', products: '/api/products' },
  });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found', statusCode: 404 } });
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, error: { message: err.message || 'Internal Server Error', statusCode } });
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EXPRESS Server Started at Port No: ${PORT}`));



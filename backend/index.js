const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const usersDB = [
  'alice@example.com',
  'bob@example.com',
  'charlie@example.com',
  'diana@example.com',
  'eve@example.com',
];

app.post('/api/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const exists = usersDB.includes(email.toLowerCase());

  if (exists) {
    return res.status(200).json({ exists: true, message: 'Email found in the database' });
  }

  return res.status(404).json({ exists: false, message: 'Email not found in the database' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const usersDB = [
  'alexandre.franca@hibob.io',
  'john.doe@example.com',
  'jane.smith@example.com',
  'email@example.com',
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

app.get('/api/check-email', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  setTimeout(() => {
    const exists = usersDB.includes(email.toLowerCase());
    return res.status(200).json({ exists });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

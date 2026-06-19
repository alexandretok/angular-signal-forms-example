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

app.post('/api/signup', (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  setTimeout(() => {
    console.log('--- New Signup Received ---');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Phone:', JSON.stringify(phone));
    console.log('--------------------------');

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

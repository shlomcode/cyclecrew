const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const subscribers = [];

app.post('/api/subscribe', (req, res) => {
  const { name, email } = req.body;
  subscribers.push({ name, email });
  console.log("Nuovo iscritto:", name, email);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server avviato su http://localhost:3000');
});
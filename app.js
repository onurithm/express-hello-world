// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Gelen WhatsApp mesajlarını geçici olarak tutacağımız dizi
let receivedMessages = [];

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests (Facebook webhook buraya gelir)
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  
  // Gelen veriyi diziye ekleyelim
  const webhookBody = req.body;
  receivedMessages.push(webhookBody);
  
  console.log(JSON.stringify(webhookBody, null, 2));
  res.status(200).end();
});

// YENİ: .NET C# uygulamamızın mesajları okuyacağı endpoint
app.get('/messages', (req, res) => {
  // Elimizdeki tüm mesajları JSON olarak dönüyoruz
  res.json(receivedMessages);
  
  // Opsiyonel: C# projeniz okuduktan sonra express belleğini temizlemek için listeyi sıfırlayabilirsiniz
  // Eğer sürekli eski mesajları da okumak istemiyorsanız alttaki yorumu kaldırabilirsiniz:
  // receivedMessages = []; 
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});

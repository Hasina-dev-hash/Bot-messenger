require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Vérification du serveur
app.get('/', (req, res) => {
  res.send('Bot Messenger en ligne !');
});

// Vérification du webhook
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook vérifié avec succès !');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook pour recevoir des messages
app.post('/webhook', (req, res) => {
  let body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      sendMessage(sender_psid, 'Salut ! 👋');
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Fonction pour envoyer un message
function sendMessage(sender_psid, message) {
  let request_body = {
    recipient: { id: sender_psid },
    message: { text: message }
  };

  request({
    uri: 'https://graph.facebook.com/v12.0/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: request_body
  }, (err, res, body) => {
    if (err) {
      console.error('Erreur lors de l\'envoi du message :', err);
    } else {
      console.log('Message envoyé avec succès !');
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});

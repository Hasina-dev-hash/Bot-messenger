const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Vérification du serveur
app.get('/', (req, res) => {
  res.send('Bot Messenger en ligne !');
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
  });
}

app.listen(3000, () => {
  console.log('Serveur en ligne sur le port 3000');
});

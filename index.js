const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for channel prefix configs
const prefixMap = {};

app.use(bodyParser.urlencoded({ extended: true }));

// POST /jira-config prefix VV
app.post('/jira-config', (req, res) => {
  const channelId = req.body.channel_id;
  const [cmd, newPrefix] = (req.body.text || '').trim().split(/\s+/);

  if (cmd !== 'prefix' || !newPrefix) {
    return res.json({
      response_type: 'ephemeral',
      text: '❌ Usage: `/jira-config prefix VV`',
    });
  }

  prefixMap[channelId] = newPrefix.toUpperCase();
  res.json({
    response_type: 'ephemeral',
    text: `✅ Jira prefix set to *${newPrefix.toUpperCase()}* for this channel.`,
  });
});

// POST /jira 420
app.post('/jira', (req, res) => {
  const channelId = req.body.channel_id;
  const ticketNumber = (req.body.text || '').trim();

  const prefix = prefixMap[channelId];
  if (!prefix) {
    return res.json({
      response_type: 'ephemeral',
      text: '⚠️ No Jira prefix set for this channel. Use `/jira-config prefix VV` first.',
    });
  }

  if (!/^\d+$/.test(ticketNumber)) {
    return res.json({
      response_type: 'ephemeral',
      text: '❌ Please enter a numeric ticket ID, like `/jira 420`',
    });
  }

  const ticketKey = `${prefix}-${ticketNumber}`;
  const url = `https://maintainnet.atlassian.net/browse/${ticketKey}`;

  res.json({
    response_type: 'in_channel',
    text: `🔗 <${url}|${ticketKey}>`,
  });
});

app.get('/', (req, res) => {
  res.send('Slack Jira Linker is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

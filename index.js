const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for channel configurations
const channelConfigs = {};

app.use(bodyParser.urlencoded({ extended: true }));

// POST /jira-config
app.post('/jira-config', (req, res) => {
  const channelId = req.body.channel_id;
  const [cmd, value] = (req.body.text || '').trim().split(/\s+/);

  if (!cmd || !value) {
    return res.json({
      response_type: 'ephemeral',
      text: '❌ Usage: `/jira-config prefix BB` or `/jira-config domain abcdef`',
    });
  }

  if (!channelConfigs[channelId]) {
    channelConfigs[channelId] = {};
  }

  if (cmd === 'prefix') {
    channelConfigs[channelId].prefix = value.toUpperCase();
    return res.json({
      response_type: 'ephemeral',
      text: `✅ Jira prefix set to *${value.toUpperCase()}* for this channel.`,
    });
  } else if (cmd === 'domain') {
    channelConfigs[channelId].domain = value.toLowerCase();
    return res.json({
      response_type: 'ephemeral',
      text: `✅ Jira domain set to *${value.toLowerCase()}* for this channel.`,
    });
  } else {
    return res.json({
      response_type: 'ephemeral',
      text: '❌ Unknown config command. Use `prefix` or `domain`.',
    });
  }
});

// POST /jira
app.post('/jira', (req, res) => {
  const channelId = req.body.channel_id;
  const ticketNumber = (req.body.text || '').trim();

  const config = channelConfigs[channelId];
  if (!config || !config.prefix || !config.domain) {
    return res.json({
      response_type: 'ephemeral',
      text: '⚠️ Jira prefix or domain not set. Use `/jira-config prefix BB` and `/jira-config domain abcdef` first.',
    });
  }

  if (!/^\d+$/.test(ticketNumber)) {
    return res.json({
      response_type: 'ephemeral',
      text: '❌ Please enter a numeric ticket ID, like `/jira 420`',
    });
  }

  const ticketKey = `${config.prefix}-${ticketNumber}`;
  const url = `https://${config.domain}.atlassian.net/browse/${ticketKey}`;

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

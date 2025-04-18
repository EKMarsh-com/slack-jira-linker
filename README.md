# Slack Jira Linker

A Slack app that generates Jira ticket links using a custom-configured prefix and domain for each Slack channel.

---

## Slash Commands

### `/jira-config prefix <PREFIX>`
Sets the Jira ticket prefix (e.g., `BB`, `SCEN`, `VV`) for the current channel.

Example:
`/jira-config prefix BB`

---

### `/jira-config domain <DOMAIN>`
Sets the Jira workspace domain (e.g., `mycompany`) for the current channel.

Example:
`/jira-config domain abcdef`

---

### `/jira <ticket-number>`
Generates a link to the configured Jira ticket.

Example:
`/jira 420`

Result:
BB-420 → https://abcdef.atlassian.net/browse/BB-420

---

## Deploy

This app runs on Node.js + Express. You can deploy to:
- Render
- Vercel
- Railway
- Your own server

---

## Setup Notes

You must set both a prefix and domain before using `/jira` in a channel.

Use:
`/jira-config prefix` 
`/jira-config domain`

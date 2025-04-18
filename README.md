# Slack Jira Linker

A simple Slack app that:
- Lets each channel configure its Jira project prefix
- Creates links to Jira tickets using a short `/jira` command

## Commands

- `/jira-config prefix VV`  
  Sets the prefix used in the current Slack channel.

- `/jira 420`  
  Turns into: https://< domain >.atlassian.net/browse/VV-420

## Deploy

This app runs on Node.js + Express. You can deploy to Render, Vercel, or your own server.

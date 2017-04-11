require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const slackEventsAPI = require('@slack/events-api');
const slackInteractiveMessages = require('@slack/interactive-messages');
const normalizePort = require('normalize-port');
const cloneDeep = require('lodash.clonedeep');
const bot = require('./lib/bot');

// --- Slack Events ---
const slackEvents = slackEventsAPI.createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);

slackEvents.on('team_join', (event) => {
  bot.introduceToUser(event.user.id);
});

slackEvents.on('message', (event) => {
  // Filter out messages from this bot itself or updates to messages
  if (event.subtype === 'bot_message' || event.subtype === 'message_changed') {
    return;
  }
  bot.handleDirectMessage(event);
});

// --- Slack Interactive Messages ---
const slackMessages =
  slackInteractiveMessages.createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);

// Helper functions

function findAttachment(message, actionCallbackId) {
  return message.attachments.find(a => a.callback_id === actionCallbackId);
}

function acknowledgeActionFromMessage(originalMessage, actionCallbackId, ackText) {
  const message = cloneDeep(originalMessage);
  const attachment = findAttachment(message, actionCallbackId);
  delete attachment.actions;
  attachment.text = `:white_check_mark: ${ackText}`;
  return message;
}

function findSelectedOption(originalMessage, actionCallbackId, selectedValue) {
  const attachment = findAttachment(originalMessage, actionCallbackId);
  return attachment.actions[0].options.find(o => o.value === selectedValue);
}

// Action handling

slackMessages.action('order:start', (payload, respond) => {
  // Create an updated message that acknowledges the user's action (even if the result of that
  // action is not yet complete).
  const updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'order:start',
                                                      'I\'m getting an order started for you.');

  // Start an order, and when that completes, send another message to the user.
  bot.startOrder(payload.user.id)
    .then(respond)
    .catch(console.error);

  // The updated message is returned synchronously in response
  return updatedMessage;
});

slackMessages.action('order:select_type', (payload, respond) => {
  const selectedType = findSelectedOption(payload.original_message, 'order:select_type', payload.actions[0].selected_options[0].value);
  const updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'order:select_type',
                                                      `You chose a ${selectedType.text.toLowerCase()}.`);

  bot.selectTypeForOrder(payload.user.id, selectedType.value)
    .then((response) => {
      // Keep the context from the updated message but use the new text and attachment
      updatedMessage.text = response.text;
      if (response.attachments && response.attachments.length > 0) {
        updatedMessage.attachments.push(response.attachments[0]);
      }
      return updatedMessage;
    })
    .then(respond)
    .catch(console.error);

  return updatedMessage;
});

slackMessages.action('order:select_option', (payload, respond) => {
  const optionName = payload.actions[0].name;
  const selectedChoice = findSelectedOption(payload.original_message, 'order:select_option', payload.actions[0].selected_options[0].value);
  const updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'order:select_option',
                                                      `You chose ${selectedChoice.text.toLowerCase()} for ${optionName.toLowerCase()}`);

  bot.selectOptionForOrder(payload.user.id, optionName, selectedChoice.value)
    .then((response) => {
      // Keep the context from the updated message but use the new text and attachment
      updatedMessage.text = response.text;
      if (response.attachments && response.attachments.length > 0) {
        updatedMessage.attachments.push(response.attachments[0]);
      }
      return updatedMessage;
    })
    .then(respond)
    .catch(console.error);

  return updatedMessage;
});

// Create the server
const port = normalizePort(process.env.PORT || '3000');
const app = express();
app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/slack/actions', slackMessages.expressMiddleware());
// Start the server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});

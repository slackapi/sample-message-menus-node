const WebClient = require('@slack/client');
const menu = require('./menu');
const map = require('lodash.map');
const axios = require('axios');

// Helper functions
function nextOptionForOrder(order) {
  const item = menu.items.find(i => i.id === order.type);
  if (!item) {
    throw new Error('This menu item was not found.');
  }
  return item.options.find(o => !Object.prototype.hasOwnProperty.call(order.options, o));
}

function orderIsComplete(order) {
  return !nextOptionForOrder(order);
}

function summarizeOrder(order) {
  const item = menu.items.find(i => i.id === order.type);
  let summary = item.name;
  const optionsText = map(order.options, (choice, optionName) => `${choice} ${optionName}`);
  if (optionsText.length !== 0) {
    summary += ` with ${optionsText.join(' and ')}`;
  }
  return summary.toLowerCase();
}

function capitalizeFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Bot
// TODO: remove
const slackClientOptions = {};
if (process.env.SLACK_ENV) {
  slackClientOptions.slackAPIUrl = process.env.SLACK_ENV;
}
const bot = {
  web: new WebClient(process.env.SLACK_BOT_TOKEN, slackClientOptions),
  orders: {},

  introduceToUser(userId) {
    this.web.im.open(userId)
      .then(resp => this.web.chat.postMessage(resp.channel.id, 'I am coffeebot, and I\'m here to help bring you fresh coffee :coffee:, made to order.\n', {
        attachments: [
          {
            color: '#5A352D',
            title: 'How can I help you?',
            callback_id: 'order:start',
            actions: [
              {
                name: 'start',
                text: 'Start a coffee order',
                type: 'button',
                value: 'order:start',
              },
            ],
          },
        ],
      }))
      .catch(console.error);
  },

  startOrder(userId) {
    // TODO: error handling
    if (this.orders[userId]) {
      return Promise.resolve({
        text: 'I\'m already working on an order for you, please be patient',
        replace_original: false,
      });
    }

    // Initialize the order
    this.orders[userId] = {
      options: {},
    };

    return Promise.resolve({
      text: 'Great! What can I get started for you?',
      attachments: [
        {
          color: '#5A352D',
          callback_id: 'order:select_type',
          text: '', // attachments must have text property defined (abstractable)
          actions: [
            {
              name: 'select_type',
              type: 'select',
              options: menu.listOfTypes(),
            },
          ],
        },
      ],
    });
  },

  selectTypeForOrder(userId, itemId) {
    const order = this.orders[userId];

    // TODO: error handling
    if (!order) {
      return Promise.resolve({
        text: 'I cannot find that order. Message me to start a new order.',
        replace_original: false,
      });
    }

    // TODO: validation?
    order.type = itemId;

    if (!orderIsComplete(order)) {
      return this.optionSelectionForOrder(userId);
    }
    return this.finishOrder(userId);
  },

  optionSelectionForOrder(userId) {
    const order = this.orders[userId];
    // TODO: what happens if this throws?
    const optionId = nextOptionForOrder(order);
    return Promise.resolve({
      text: `Working on your ${summarizeOrder(order)}.`,
      attachments: [
        {
          color: '#5A352D',
          callback_id: 'order:select_option',
          text: `Which ${optionId} would you like?`,
          actions: [
            {
              name: optionId,
              type: 'select',
              options: menu.listOfChoicesForOption(optionId),
            },
          ],
        },
      ],
    });
  },

  selectOptionForOrder(userId, optionId, optionValue) {
    const order = this.orders[userId];

    // TODO: error handling
    if (!order) {
      return Promise.resolve({
        text: 'I cannot find that order. Message me to start a new order.',
        replace_original: false,
      });
    }

    // TODO: validation?
    order.options[optionId] = optionValue;

    if (!orderIsComplete(order)) {
      return this.optionSelectionForOrder(userId);
    }
    return this.finishOrder(userId);
  },

  // TODO: error handling
  finishOrder(userId) {
    const order = this.orders[userId];
    const item = menu.items.find(i => i.id === order.type);
    let fields = [
      {
        title: 'Drink',
        value: item.name,
      },
    ];
    fields = fields.concat(map(order.options, (choiceId, optionId) => {
      const choiceName = menu.choiceNameForId(optionId, choiceId);
      return { title: capitalizeFirstChar(optionId), value: choiceName };
    }));

    return axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `<@${userId}> has submitted a new coffee order.`,
      attachments: [
        {
          color: '#5A352D',
          title: 'Order details',
          text: summarizeOrder(order),
          fields,
        },
      ],
    }).then(() => Promise.resolve({
      text: `Your order of a ${summarizeOrder(order)} is coming right up!`,
    }));
  },

  handleDirectMessage(message) {
    if (!this.orders[message.user]) {
      this.introduceToUser(message.user);
    } else {
      this.web.chat.postMessage(message.channel, 'Let\'s keep working on the open order.')
        .catch(console.error);
    }
  },
};

module.exports = bot;

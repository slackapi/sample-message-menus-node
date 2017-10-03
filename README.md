# Message Menus API Sample for Node

[Message menus](https://api.slack.com/docs/message-menus) are a feature of the Slack Platform that allow your Slack app to display a set of choices to users within a message.

This sample demonstrates building a coffeebot, which helps you customize a drink order using message menus.

![Demo](support/demo.gif "Demo")

Start by DMing the bot (or it will DM you when you join the team). Coffeebot introduces itself and gives you a message button to start a drink order. Coffees can be complicated so the bot gives you menus to make your drink just right (e.g. mocha, non fat milk, with a triple shot). It sends your completed order off to a channel where your baristas are standing by.

You can either develop this app locally or you can [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/slack-message-menus-node)

## Setup

### Create a Slack app

To start, create an app at [api.slack.com/apps](https://api.slack.com/apps) and configure it with a bot user, event subscriptions, interactive messages, and an incoming webhook. This sample app uses the [Slack Event Adapter](https://github.com/slackapi/node-slack-events-api), where you can find some configuration steps to get the Events API ready to use in your app.


### Bot user

Click on the Bot user feature on your app configuration page. Assign it a username (such as
`@coffeebot`), enable it to be always online, and save changes.

### Event subscriptions

Turn on Event Subscriptions for the Slack app. You must input and verify a Request URL, and the easiest way to do this is to [use a development proxy as described in the Events API module](https://github.com/slackapi/node-slack-events-api#configuration). The application listens for events at the path `/slack/events`:

- ngrok or Glitch URL + `/slack/events`

Create a subscription to the team event `team_join` and a bot event for `message.im`. Save your changes.

### Interactive Messages
Click on `Interactive Messages` on the left side navigation, and enable it. Input your *Request URL*:

- ngrok or Glitch URL + `/slack/actions`

_(there's a more complete explanation of Interactive Message configuration on the [Node Slack Interactive Messages module](https://github.com/slackapi/node-slack-interactive-messages#configuration))._

### Incoming webhook

Create a channel in your development team for finished coffee orders (such as `#coffee`). Add an incoming webhook to your app's configuration and select this team. Complete it by authorizing the webhook on your team.

### Environment variables

You should now have a Slack verification token (basic information), access token, and webhook URL (install app). 

You can develop the app locally by cloning this repository. Or you can [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/slack-message-menus-node)

**If you're developing locally:**

1. Create a new file named `.env` (see `.env.sample`) within the directory and place the values as shown below
2. Download the dependencies for the application by running `npm install`. Note that this example assumes you are using a currently supported LTS version of Node (at this time, v6 or above).
3. Start the app (`npm start`)

**If you're using Glitch:**
1. Enter the enviornmental variables in `.env` as shown below


```
SLACK_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxxx
SLACK_BOT_TOKEN=xoxb-0000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx/yyyyyyyyy/zzzzzzzzzzzzzzzzzzzzzzzz
```


## Usage

Go ahead and DM `@coffeebot` to see the app in action!

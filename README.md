# Message Menus API Sample for Node

[Message menus](https://api.slack.com/docs/message-menus) are a feature of the Slack Platform
that allow your Slack app to display a set of choices to users within a message.

This sample demonstrates building a coffeebot, which helps you customize a drink order using message
menus.

![Demo](support/demo.gif "Demo")

Start by DMing the bot (or it will DM you when you join the team). Coffeebot introduces itself and
gives you a message button to start a drink order. Coffees can be complicated so the bot gives you
menus to make your drink just right (e.g. mocha, non fat milk, with a triple shot). It sends your
completed order off to a channel where your baristas are standing by.

## Set Up

You should start by [creating a Slack app](https://api.slack.com/slack-apps) and configuring it
with a bot user, event subscriptions, and an incoming webhook. This sample app uses the
[Slack Event Adapter](https://github.com/slackapi/node-slack-events-api), where you can find some
configuration steps to get the Events API ready to use in your app.

### Bot user

Click on the Bot user feature on your app configuration page. Assign it a username (such as
`@coffeebot`), enable it to be always online, and save changes.

### Event subscriptions

Turn on Event Subscriptions for the Slack app. You must input and verify a Request URL, and the
easiest way to do this is to
[use a development proxy as described in the Events API module](https://github.com/slackapi/node-slack-events-api#configuration).
The application listens for events at the path `/slack/events`. For example, the Request URL may
look like `https://mymessagemenusample.ngrok.io/slack/events`.
Create a subscription to the team event `team_join` and a bot event for `message.im`. Save your changes.

### Incoming webhook

Create a channel in your development team for finished coffee orders (such as `#coffee`). Add an
incoming webhook to your app's configuration and select this team. Complete it by authorizing the
webhook on your team.

### Environment variables

You should now have a Slack verification token (basic information), access token, and webhook URL
(install app). Clone this application locally. Create a new file named `.env` within the directory
and place these values as shown:

```
SLACK_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxxx
SLACK_CLIENT_TOKEN=xoxp-0000000000-0000000000-0000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx/yyyyyyyyy/zzzzzzzzzzzzzzzzzzzzzzzz
```

Lastly, download the dependencies for the application by running `npm install`. Note that this
example assumes you are using a currently supported LTS version of Node (at this time, v6 or above).

## Start it up

Run the application using `npm start`. Go ahead and DM `@coffeebot` to see the app in action!

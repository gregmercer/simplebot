# simplebot
simplebot - A simple bot for Slack using the nodejs "slackbots" package

Create a directory called simplebot
```
mkdir simplebot
cd simplebot
```

Create sub directories bin and lib
```
mkdir bin
mkdir lib
```

Initialize your nodejs project - This will create a package.json file
```
npm init
```

Install the slackbots package
```
npm i --save slackbots
```

Edit the package.json file to have the following:
  Note: The changes should only be related to the "main", "bin", and "scripts" sections.
  All the other lines should have been created during the npm init step from above
```
{
  "name": "simplebot",
  "version": "0.0.0",
  "description": "",
  "main": "lib/simplebot.js",
  "bin": {
    "simplebot": "bin/bot.js"
  },
  "scripts": {
    "start": "node bin/bot.js",
    "test": "bin/bot.js lib/simplebot.js"
  },
  "author": "",
  "license": "BSD-2-Clause",
  "dependencies": {
    "slackbots": "~0.5.0"
  }
}
```

Add your Bot integration to your Slack team.
Enter your bot name and after submitting note the "API Token" (you'll need to know this for a later step).
```
https://<your slack team name>.slack.com/services/new/bot
```

Create a bin/bot.js file
```
#!/usr/bin/env node

'use strict';

/**
 * SimpleBot launcher script.
 *
 * Adapted from the following tutorial:
 *   https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers
 */

var SimpleBot = require('../lib/simplebot');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization.
 *    You can get your token at the following url:
 *      https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_NAME: the username you want to give to the bot within your organization.
 */
var token = process.env.BOT_API_KEY || require('../token');
var name = process.env.BOT_NAME;

var simplebot = new SimpleBot({
    token: token,
    name: name
});

simplebot.run();
```

Create a lib/simplebot.js file
```
'use strict';

var util = require('util');
var Bot = require('slackbots');

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *    token : the API token of the bot (mandatory)
 *    name : the name of the bot (will default to "simplebot")
 *
 * @param {object} settings
 * @constructor
 */
var SimpleBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'simplebot';
};

// inherits methods and properties from the Bot constructor
util.inherits(SimpleBot, Bot);

/**
 * Run the bot
 * @public
 */
SimpleBot.prototype.run = function () {
  SimpleBot.super_.call(this, this.settings);

  this.on('start', this._onStart);
  this.on('message', this._onMessage);
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
SimpleBot.prototype._onStart = function () {
  this.postMessageToChannel('general', 'Hello channel!');
};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
SimpleBot.prototype._onMessage = function (message) {
  console.log(message);
};

module.exports = SimpleBot;
```

Create a run.sh file. Be sure to change the BOT_API_KEY to match your integration
```
#!/bin/bash

BOT_API_KEY=<your slack bot API Token> node bin/bot.js
```

Start your bot
```
sh run.sh
```

If all goes well you should see your bot's message on your team's #general Slack channel
```
simplebot
Hello channel!
```

Next with your bot still running in your terminal, send a message in the #general channel.
You should notice your new #general channel message being logged by your bot.
Your log should look something like this:
```
gregs-mac:simplebot$ sh run.sh
{ type: 'hello' }
{ text: 'Hello channel!',
  username: 'simplebot',
  type: 'message',
  subtype: 'bot_message',
  channel: 'C0G0VF4F6',
  ts: '1449506019.000008' }
{ type: 'presence_change',
  user: 'U0G0VP5PW',
  presence: 'active' }
{ type: 'user_typing', channel: 'C0G0VF4F6', user: 'U070N0C6T' }
{ type: 'user_typing', channel: 'C0G0VF4F6', user: 'U070N0C6T' }
{ type: 'message',
  channel: 'C0G0VF4F6',
  user: 'U070N0C6T',
  text: 'It worked.',
  ts: '1449506049.000009',
  team: 'T06V9UG3U' }
```

Now that things are running ok locally, let's deploy your bot to a hosting service.

Steps to deploy your bot on Heroku:

Create a "Profile" file
```
worker: node bin/bot.js
```

Create a new app on Heroku.
```
https://dashboard.heroku.com/new
```

Next add the settings your bot will need
```
BOT_API_KEY <your slack bot API Token>
BOT_NAME simplebot
```

Run the following commands to setup and commit the project to git
```
git init
echo "node_modules/" >> .gitignore
echo "run.sh" >> .gitignore
git add --all
git commit -am "initial commit"
```

Log into Heroku
```
heroku login
```

Push your project up to Heroku. This should also start the app.
```
heroku git:remote -a <your Heroku app name goes here>
git push heroku master
```

Now check your Heroku logs
```
heroku logs
```

Much thanks to Luciano Mammino (@loige) for his detailed notes on all of this:
His blog describes a Chuck Norris Bot that shows how to create a fully functional bot, backed by a sqlite3 db.
```
https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers
```

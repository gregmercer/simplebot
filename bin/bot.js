#!/usr/bin/env node

'use strict';

/**
 * For Heroku, I needed to make this small adjustment.
 *   - Running a dummy web process of sorts
 */

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

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

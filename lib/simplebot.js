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

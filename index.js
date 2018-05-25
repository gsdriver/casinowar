//
// Main handler for Alexa casino war table skill
//

'use strict';

const AWS = require('aws-sdk');
const Alexa = require('alexa-sdk');
const Launch = require('./intents/Launch');
const Bet = require('./intents/Bet');
const Help = require('./intents/Help');
const Exit = require('./intents/Exit');
const Repeat = require('./intents/Repeat');
const HighScore = require('./intents/HighScore');
const War = require('./intents/War');
const SideBet = require('./intents/SideBet');
const resources = require('./resources');
const utils = require('./utils');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.af231135-5719-460a-85cc-af8b684c6069';

const atWarHandlers = Alexa.CreateStateHandler('ATWAR', {
  'NewSession': function() {
    this.handler.state = '';
    this.emitWithState('NewSession');
  },
  'LaunchRequest': Launch.handleIntent,
  'HighScoreIntent': HighScore.handleIntent,
  'AMAZON.RepeatIntent': Repeat.handleIntent,
  'AMAZON.FallbackIntent': Repeat.handleIntent,
  'AMAZON.HelpIntent': Help.handleIntent,
  'AMAZON.YesIntent': War.handleYesIntent,
  'AMAZON.NoIntent': War.handleNoIntent,
  'AMAZON.StopIntent': Exit.handleIntent,
  'AMAZON.CancelIntent': Exit.handleIntent,
  'Unhandled': function() {
    utils.emitResponse(this, null, null, this.t('UNKNOWN_INTENT'), this.t('UNKNOWN)INTENT_REPROMPT'));
  },
  'SessionEndedRequest': function() {
    saveState(this.event.session.user.userId, this.attributes);
  },
});

const playingHandlers = Alexa.CreateStateHandler('PLAYING', {
  'NewSession': function() {
    this.handler.state = '';
    this.emitWithState('NewSession');
  },
  'LaunchRequest': Launch.handleIntent,
  'BetIntent': Bet.handleIntent,
  'PlaceSideBetIntent': SideBet.handlePlaceIntent,
  'RemoveSideBetIntent': SideBet.handleRemoveIntent,
  'HighScoreIntent': HighScore.handleIntent,
  'AMAZON.RepeatIntent': Repeat.handleIntent,
  'AMAZON.FallbackIntent': Repeat.handleIntent,
  'AMAZON.HelpIntent': Help.handleIntent,
  'AMAZON.YesIntent': Bet.handleIntent,
  'AMAZON.NoIntent': Exit.handleIntent,
  'AMAZON.StopIntent': Exit.handleIntent,
  'AMAZON.CancelIntent': Exit.handleIntent,
  'Unhandled': function() {
    utils.emitResponse(this, null, null, this.t('UNKNOWN_INTENT'), this.t('UNKNOWN)INTENT_REPROMPT'));
  },
  'SessionEndedRequest': function() {
    saveState(this.event.session.user.userId, this.attributes);
  },
});

const handlers = {
  'NewSession': function() {
    // Initialize attributes and route the request
    this.attributes.playerLocale = this.event.request.locale;
    if (!this.attributes.currentGame) {
      utils.initializeGame(this, 'basic');
    }
    if (!this.attributes.temp) {
      this.attributes.temp = {};
    }

    this.emit('LaunchRequest');
  },
  'LaunchRequest': Launch.handleIntent,
  'Unhandled': function() {
    utils.emitResponse(this, null, null, this.t('UNKNOWN_INTENT'), this.t('UNKNOWN)INTENT_REPROMPT'));
  },
  'SessionEndedRequest': function() {
    saveState(this.event.session.user.userId, this.attributes);
  },
};

if (process.env.DASHBOTKEY) {
  const dashbot = require('dashbot')(process.env.DASHBOTKEY).alexa;
  exports.handler = dashbot.handler(runGame);
} else {
  exports.handler = runGame;
}

function runGame(event, context, callback) {
  AWS.config.update({region: 'us-east-1'});

  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.resources = resources.languageStrings;
  if (!event.session.sessionId || event.session['new']) {
    const doc = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    doc.get({TableName: 'War',
            ConsistentRead: true,
            Key: {userId: event.session.user.userId}},
            (err, data) => {
      if (err || (data.Item === undefined)) {
        if (err) {
          console.log('Error reading attributes ' + err);
        } else {
          request.post({url: process.env.SERVICEURL + 'war/newUser'}, (err, res, body) => {
          });
        }
      } else {
        Object.assign(event.session.attributes, data.Item.mapAttr);
      }

      execute();
    });
  } else {
    execute();
  }

  function execute() {
    alexa.registerHandlers(handlers, atWarHandlers, playingHandlers);
    alexa.execute();
  }
}

function saveState(userId, attributes) {
  const formData = {};

  formData.savedb = JSON.stringify({
    userId: userId,
    attributes: attributes,
  });

  const params = {
    url: process.env.SERVICEURL + 'war/saveState',
    formData: formData,
  };

  request.post(params, (err, res, body) => {
    if (err) {
      console.log(err);
    }
  });
}

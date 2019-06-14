//
// Main handler for Alexa casino war table skill
//

'use strict';

const Alexa = require('ask-sdk');
const CanFulfill = require('./intents/CanFulfill');
const Launch = require('./intents/Launch');
const Bet = require('./intents/Bet');
const Help = require('./intents/Help');
const Exit = require('./intents/Exit');
const Repeat = require('./intents/Repeat');
const HighScore = require('./intents/HighScore');
const War = require('./intents/War');
const NoWar = require('./intents/NoWar');
const PlaceSideBet = require('./intents/PlaceSideBet');
const RemoveSideBet = require('./intents/RemoveSideBet');
const SessionEnd = require('./intents/SessionEnd');
const Unhandled = require('./intents/Unhandled');
const utils = require('./utils');
const request = require('request');
const ssmlCheck = require('ssml-check-core');

const requestInterceptor = {
  process(handlerInput) {
    return new Promise((resolve, reject) => {
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      const event = handlerInput.requestEnvelope;

      if ((Object.keys(sessionAttributes).length === 0) ||
        ((Object.keys(sessionAttributes).length === 1)
          && sessionAttributes.bot)) {
        // No session attributes - so get the persistent ones
        attributesManager.getPersistentAttributes()
          .then((attributes) => {
            // If no persistent attributes, it's a new player
            if (!attributes.currentGame) {
              utils.initializeGame(event, attributes, 'basic');
              attributes.playerLocale = event.request.locale;
              request.post({url: process.env.SERVICEURL + 'war/newUser'}, (err, res, body) => {
              });
            }

            // Since there were no session attributes, this is the first
            // round of the session - set the temp attributes
            attributes.temp = {};
            attributes.sessions = (attributes.sessions + 1) || 1;
            attributes.bot = sessionAttributes.bot;
            attributesManager.setSessionAttributes(attributes);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve();
      }
    });
  },
};

const saveResponseInterceptor = {
  process(handlerInput) {
    const response = handlerInput.responseBuilder.getResponse();

    if (response) {
      return utils.drawTable(handlerInput).then(() => {
        if (response.shouldEndSession) {
          // We are meant to end the session
          SessionEnd.handle(handlerInput);
        }

        if (response.outputSpeech && response.outputSpeech.ssml) {
          return ssmlCheck.verifyAndFix(response.outputSpeech.ssml, {platform: 'amazon'});
        } else {
          return Promise.resolve({});
        }
      }).then((result) => {
        if (result.fixedSSML) {
          const oldSSML = response.outputSpeech.ssml;
          response.outputSpeech.ssml = result.fixedSSML;

          // Write to S3
          const params = {
            Body: oldSSML + ' became ' + result.fixedSSML,
            Bucket: 'garrett-alexa-responses',
            Key: 'war' + '/' + Date.now() + '.txt',
          };
          return s3.putObject(params).promise();
        }
      });
    } else {
      return Promise.resolve();
    }
  },
};

const ErrorHandler = {
  canHandle(handlerInput, error) {
    console.log(error);
    return error.name.startsWith('AskSdk');
  },
  handle(handlerInput, error) {
    return handlerInput.responseBuilder
      .speak('An error was encountered while handling your request. Try again later')
      .getResponse();
  },
};

if (process.env.DASHBOTKEY) {
  const dashbot = require('dashbot')(process.env.DASHBOTKEY).alexa;
  exports.handler = dashbot.handler(runGame);
} else {
  exports.handler = runGame;
}

function runGame(event, context, callback) {
  const skillBuilder = Alexa.SkillBuilders.standard();
  const start = Date.now();

  if (!process.env.NOLOG) {
    console.log(JSON.stringify(event));
  }

  // If this is a CanFulfill, handle this separately
  if (event.request && (event.request.type == 'CanFulfillIntentRequest')) {
    callback(null, CanFulfill.check(event));
    return;
  }

  const skillFunction = skillBuilder.addRequestHandlers(
      Launch,
      HighScore,
      Help,
      War,
      NoWar,
      Exit,
      Repeat,
      Bet,
      PlaceSideBet,
      RemoveSideBet,
      SessionEnd,
      Unhandled
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(requestInterceptor)
    .addResponseInterceptors(saveResponseInterceptor)
    .withTableName('War')
    .withAutoCreateTable(true)
    .withSkillId('amzn1.ask.skill.af231135-5719-460a-85cc-af8b684c6069')
    .lambda();
  skillFunction(event, context, (err, response) => {
    console.log('Took ' + (Date.now() - start) + ' ms');
    callback(err, response);
  });
}


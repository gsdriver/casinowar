'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const Lambda = new AWS.Lambda();

function ssmlToText(ssml) {
  let text = ssml;

  // Remove all angle brackets
  text = ssml.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function close(sessionAttributes, fulfillmentState, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message,
    },
  };
}

function passToAlexa(intentRequest, intentName, callback) {
  // Just pass this to Alexa
  const lambda = {
    'session': {
      'sessionId': 'SessionId.c88ec34d-28b0-46f6-a4c7-120d8fba8fa7',
      'application': {
        'applicationId': 'amzn1.ask.skill.af231135-5719-460a-85cc-af8b684c6069',
      },
      'user': {
        'userId': 'lex-' + intentRequest.userId,
      },
    },
    'request': {
      'requestId': 'EdwRequestId.26405959-e350-4dc0-8980-14cdc9a4e921',
      'timestamp': Date.now(),
    },
    'version': '1.0',
  };

  // Do we have Alexa attributes
  if (!intentRequest.sessionAttributes.alexa) {
    lambda.session.attributes = {};
    lambda.session.new = true;
    lambda.request.type = 'LaunchRequest';
    lambda.request.locale = 'en-US';
    lambda.request.intent = {};
  } else {
    lambda.session.attributes = JSON.parse(intentRequest.sessionAttributes.alexa);
    lambda.session.new = false;
    lambda.request.type = 'IntentRequest';
    lambda.request.locale = lambda.session.attributes.playerLocale;
    lambda.request.intent = {
      'name': intentName,
      'slots': {},
    };

    let slot;
    for (slot in intentRequest.currentIntent.slots) {
      if (slot) {
        lambda.request.intent.slots[slot] = {
          'name': slot,
          'value': intentRequest.currentIntent.slots[slot],
        };
      }
    }
  }

  Lambda.invoke({FunctionName: 'CasinoWar', Payload: JSON.stringify(lambda)}, (err, data) => {
    if (err) {
      console.log(err);
      callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        {
          contentType: 'PlainText',
          content: 'Sorry, I encountered a problem. Please try again later.',
        }));
    } else {
      const response = JSON.parse(data.Payload);
      callback(close({'alexa': JSON.stringify(response.sessionAttributes)}, 'Fulfilled',
        {
          contentType: 'PlainText',
          content: ssmlToText(response.response.outputSpeech.ssml),
        }));
    }
  });
}

function dispatch(intentRequest, callback) {
  if (!process.env.NOLOG) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  }

  const intentName = intentRequest.currentIntent.name;
  let alexaIntent;

  switch (intentName) {
    case 'Bet':
      alexaIntent = 'BetIntent';
      break;
    case 'Cancel':
      alexaIntent = 'AMAZON.CancelIntent';
      break;
    case 'Help':
      alexaIntent = 'AMAZON.HelpIntent';
      break;
    case 'HighScore':
      alexaIntent = 'HighScoreIntent';
      break;
    case 'No':
      alexaIntent = 'AMAZON.NoIntent';
      break;
    case 'PlaceSideBet':
      alexaIntent = 'PlaceSideBetIntent';
      break;
    case 'RemoveSideBet':
      alexaIntent = 'RemoveSideBetIntent';
      break;
    case 'Repeat':
      alexaIntent = 'AMAZON.RepeatIntent';
      break;
    case 'Yes':
      alexaIntent = 'AMAZON.YesIntent';
      break;
    default:
      break;
  }

  if (alexaIntent) {
    passToAlexa(intentRequest, alexaIntent, callback);
  } else {
    throw new Error(`Intent ${intentName} not supported`);
  }
}

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
  try {
    if (!process.env.NOLOG) {
      console.log(JSON.stringify(event));
      console.log(`event.bot.name=${event.bot.name}`);
    }

    if (event.bot.name !== 'CasinoWar') {
      callback('Invalid Bot Name');
    }

    dispatch(event, (response) => callback(null, response));
  } catch (err) {
    callback(err);
  }
};

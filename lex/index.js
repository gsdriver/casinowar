'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const Lambda = new AWS.Lambda();

function ssmlToText(ssml) {
  let text = ssml;

  // Replace war audio file with tie speech
  text = text.replace(/<audio.*war\/war[^>]+>/g, ' It\'s a tie! ');

  // Replace break with ...
  text = text.replace(/<break[^>]+>/g, ' ... ');

  // Remove all other angle brackets
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function mapDeck(deck) {
  // To keep size of attributes down, this function maps the deck to a string
  let text = '';

  deck.forEach((card) => {
    text += ('.' + card.rank + '-' + card.suit);
  });

  return text.substr(1);
}

function parseDeck(text) {
  const cards = text.split('.');
  const deck = [];

  cards.forEach((card) => {
    const thisCard = card.split('-');
    deck.push({rank: parseInt(thisCard[0], 10), suit: thisCard[1]});
  });

  return deck;
}

function passToAlexa(intentRequest, intentName, callback) {
  // Just pass this to Alexa
  const lambda = {
    'session': {
      'sessionId': 'SessionId.c88ec34d-28b0-46f6-a4c7-120d8fba8fa7',
      'application': {
        'applicationId': 'amzn1.ask.skill.af231135-5719-460a-85cc-af8b684c6069',
      },
      'attributes': {'bot': true},
      'user': {
        'userId': 'LEX-' + intentRequest.userId,
      },
    },
    'request': {
      'requestId': 'EdwRequestId.26405959-e350-4dc0-8980-14cdc9a4e921',
      'timestamp': Date.now(),
    },
    'version': '1.0',
    'context': {
      'System': {
        'application': {
          'applicationId': 'amzn1.ask.skill.af231135-5719-460a-85cc-af8b684c6069'
        },
        'user': {
          'userId': 'LEX-' + intentRequest.userId,
        },
      }
    },
  };

  // Is this a LaunchRequest or intent?
  if (intentName == 'LaunchRequest') {
    lambda.request.type = 'LaunchRequest';
  } else {
    lambda.request.type = 'IntentRequest';
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

  // Do we have Alexa attributes
  if (!intentRequest.sessionAttributes || !intentRequest.sessionAttributes.alexa) {
    lambda.session.new = true;
    lambda.request.locale = 'en-US';
  } else {
    const attributes = JSON.parse(intentRequest.sessionAttributes.alexa);
    if (attributes.basic && attributes.basic.deck) {
      attributes.basic.deck = parseDeck(attributes.basic.deck);
    }
    lambda.session.attributes = Object.assign(lambda.session.attributes, attributes);
    lambda.session.new = false;
    lambda.request.locale = lambda.session.attributes.playerLocale;
  }

  Lambda.invoke({FunctionName: 'CasinoWar2', Payload: JSON.stringify(lambda)}, (err, data) => {
    if (err) {
      console.log(err);
      callback({
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: 'Sorry, I encountered a problem. Please try again later.',
          },
        },
      });
    } else {
      // Is the session open or closed?
      const alexaResponse = JSON.parse(data.Payload);
      if (alexaResponse.sessionAttributes.basic && alexaResponse.sessionAttributes.basic.deck) {
        alexaResponse.sessionAttributes.basic.deck =
            mapDeck(alexaResponse.sessionAttributes.basic.deck);
      }
      const response = {
        sessionAttributes: {'alexa': JSON.stringify(alexaResponse.sessionAttributes)},
        dialogAction: {
          message: {
            contentType: 'PlainText',
            content: ssmlToText(alexaResponse.response.outputSpeech.ssml),
          },
        },
      };

      if (alexaResponse.response.shouldEndSession) {
        response.dialogAction.type = 'Close';
        response.dialogAction.fulfillmentState = 'Fulfilled';
      } else {
        response.dialogAction.type = 'ElicitIntent';
      }

      callback(response);
    }
  });
}

function dispatch(intentRequest, callback) {
  const intentName = intentRequest.currentIntent.name;
  const mapping = {'Bet': 'BetIntent', 'Cancel': 'AMAZON.CancelIntent', 'Help': 'AMAZON.HelpIntent',
    'HighScore': 'HighScoreIntent', 'No': 'AMAZON.NoIntent', 'PlaceSideBet': 'PlaceSideBetIntent',
    'RemoveSideBet': 'RemoveSideBetIntent', 'Launch': 'LaunchRequest',
    'Repeat': 'AMAZON.RepeatIntent', 'Yes': 'AMAZON.YesIntent',
  };
  const alexaIntent = mapping[intentName];

  if (!process.env.NOLOG) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
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

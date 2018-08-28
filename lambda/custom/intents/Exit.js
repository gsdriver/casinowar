//
// Handles stop, which will exit the skill
//

'use strict';

const utils = require('../utils');
const ads = require('../ads');

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    // Can always handle with Stop and Cancel
    if (request.type === 'IntentRequest') {
      if ((request.intent.name === 'AMAZON.CancelIntent')
        || (request.intent.name === 'AMAZON.StopIntent')) {
        return true;
      }

      // Can also handle No if said while not at war
      if (request.intent.name === 'AMAZON.NoIntent') {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (!utils.atWar(attributes)) {
          return true;
        }
      }
    }

    return false;
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);

    if (attributes.bot) {
      return handlerInput.responseBuilder
        .speak(res.strings.EXIT_GAME.replace('{0}', ''))
        .getResponse();
    } else {
      return new Promise((resolve, reject) => {
        ads.getAd(attributes, 'war', event.request.locale, (adText) => {
          const response = handlerInput.responseBuilder
            .speak(res.strings.EXIT_GAME.replace('{0}', adText))
            .withShouldEndSession(true)
            .getResponse();
          resolve(response);
        });
      });
    }
  },
};

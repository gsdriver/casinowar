//
// Handles the side bet
//

'use strict';

const utils = require('../utils');

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (!utils.atWar(attributes) && (request.type === 'IntentRequest')
      && (request.intent.name === 'RemoveSideBetIntent'));
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);
    const game = attributes[attributes.currentGame];

    game.sideBet = undefined;
    return handlerInput.responseBuilder
      .speak(res.strings.SIDEBET_REMOVED)
      .reprompt(res.strings.SIDEBET_REPROMPT)
      .getResponse();
  },
};

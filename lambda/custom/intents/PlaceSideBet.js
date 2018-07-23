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
      && (request.intent.name === 'PlaceSideBetIntent'));
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);

    // The bet amount is optional - if not present we will use a default value
    // of either the last bet amount or the minimum bet
    utils.getBetAmount(event, attributes, (amount, speechError, repromptError) => {
      if (speechError) {
        handlerInput.responseBuilder
          .speak(speechError)
          .reprompt(repromptError);
        return;
      }

      const game = attributes[attributes.currentGame];
      game.sideBet = amount;
      const speech = res.strings.SIDEBET_PLACED.replace('{0}', game.sideBet);
      handlerInput.responseBuilder
        .speak(speech)
        .reprompt(res.strings.SIDEBET_REPROMPT);
    });
  },
};

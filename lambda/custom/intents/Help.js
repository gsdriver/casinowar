//
// Handles help
//

'use strict';

const utils = require('../utils');

module.exports = {
  canHandle: function(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return ((request.type === 'IntentRequest') && (request.intent.name === 'AMAZON.HelpIntent'));
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);

    if (attributes.bot) {
      return handlerInput.responseBuilder
        .speak(res.strings.HELP_BOT_COMMANDS)
        .reprompt(res.strings.HELP_BOT_COMMANDS)
        .getResponse();
    } else {
      const game = attributes[attributes.currentGame];

      const hand = utils.readHand(event, attributes, true);
      const helpText = res.strings.HELP_CARD_TEXT
        .replace('{0}', game.rules.minBet)
        .replace('{1}', game.rules.maxBet)
        .replace('{2}', game.rules.minBet)
        .replace('{3}', game.rules.maxBet);
      const help = hand.speech + res.strings.HELP_TEXT + hand.reprompt;

      return handlerInput.responseBuilder
        .speak(help)
        .reprompt(hand.reprompt)
        .withSimpleCard(res.strings.HELP_CARD_TITLE, helpText)
        .getResponse();
    }
  },
};

//
// Handles going to War!
//

'use strict';

const utils = require('../utils');

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (utils.atWar(attributes) && (request.type === 'IntentRequest')
      && (request.intent.name === 'AMAZON.NoIntent'));
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);
    const game = attributes[attributes.currentGame];
    let speech;
    const reprompt = res.strings.BET_PLAY_AGAIN;

    if (!game.wars) {
      game.wars = {};
    }
    game.wars.surrender = (game.wars.surrender + 1) || 1;

    // You lose half your bet
    game.bankroll += Math.floor(game.bet / 2);
    game.specialState = 'surrender';
    speech = res.strings.WAR_SURRENDER;
    if ((game.bankroll < game.rules.minBet) && game.rules.canReset) {
      game.bankroll = game.startingBankroll;
      speech += res.strings.RESET_BANKROLL.replace('{0}', game.bankroll);
    }

    speech += reprompt;
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .getResponse();
  },
};

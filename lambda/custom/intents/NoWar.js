//
// Handles going to War!
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (utils.atWar(attributes) && (request.type === 'IntentRequest')
      && (request.intent.name === 'AMAZON.NoIntent'));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];
    let postName;

    voicehub.setLocale(handlerInput);
    if (!game.wars) {
      game.wars = {};
    }
    game.wars.surrender = (game.wars.surrender + 1) || 1;

    // You lose half your bet
    game.bankroll += Math.floor(game.bet / 2);
    game.specialState = 'surrender';
    if ((game.bankroll < game.rules.minBet) && game.rules.canReset) {
      game.bankroll = game.startingBankroll;
      postName = 'WarResetBankroll';
    } else {
      postName = 'WarSurrender';
    }

    const post = await voicehub
      .intent('WarIntent')
      .post(postName)
      .withParameters({
        bankroll: game.bankroll,
      })
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

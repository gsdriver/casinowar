//
// Handles the side bet
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (!utils.atWar(attributes) && (request.type === 'IntentRequest')
      && (request.intent.name === 'PlaceSideBetIntent'));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    // The bet amount is optional - if not present we will use a default value
    // of either the last bet amount or the minimum bet
    voicehub.setLocale(handlerInput);
    const output = await utils.getBetAmount(event, attributes);
    if (output.speech) {
      return handlerInput.responseBuilder
        .speak(output.speech)
        .reprompt(output.reprompt)
        .getResponse();
    }

    const game = attributes[attributes.currentGame];
    game.sideBet = output.amount;
    const post = await voicehub
      .intent('SideBetIntent')
      .post('PlaceSideBet')
      .withParameters({
        bet: game.sideBet,
      })
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

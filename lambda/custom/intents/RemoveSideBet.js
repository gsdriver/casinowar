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
      && (request.intent.name === 'RemoveSideBetIntent'));
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];

    voicehub.setLocale(handlerInput);
    game.sideBet = undefined;
    const post = await voicehub
      .intent('SideBetIntent')
      .post('RemoveSideBet')
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

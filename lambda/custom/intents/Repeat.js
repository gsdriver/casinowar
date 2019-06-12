//
// Handles help
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle: function(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return ((request.type === 'IntentRequest') &&
      ((request.intent.name === 'AMAZON.RepeatIntent') ||
       (request.intent.name === 'AMAZON.FallbackIntent')));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];

    voicehub.setLocale(handlerInput);
    const hand = await utils.readHand(handlerInput, true);

    if (game.bet) {
      const post = await voicehub
        .intent('AMAZON.RepeatIntent')
        .post((game.sideBet) ? 'RepeatSideBet' : 'RepeatBet')
        .withParameters({
          bet: game.bet,
          sidebet: game.sideBet,
          hand: hand.speech + hand.reprompt,
        })
        .get();

      return handlerInput.responseBuilder
        .speak(post.speech)
        .reprompt(hand.reprompt)
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(hand.speech + hand.reprompt)
        .reprompt(hand.reprompt)
        .getResponse();
    }
  },
};

//
// Handles help
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle: function(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return ((request.type === 'IntentRequest') && (request.intent.name === 'AMAZON.HelpIntent'));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    voicehub.setLocale(handlerInput);
    if (attributes.bot) {
      const post = await voicehub
        .intent('AMAZON.HelpIntent')
        .post('BotResponse')
        .get();

      return handlerInput.responseBuilder
        .speak(post.speech)
        .reprompt(post.reprompt)
        .getResponse();
    } else {
      const game = attributes[attributes.currentGame];

      const hand = await utils.readHand(handlerInput, true);
      const help = await voicehub
        .intent('AMAZON.HelpIntent')
        .post('HelpResponse')
        .withParameters({
          minbet: game.rules.minBet,
          maxbet: game.rules.maxBet,
          handtext: hand.speech,
          handreprompt: hand.reprompt,
        })
        .get();

      return handlerInput.responseBuilder
        .speak(help.speech)
        .reprompt(hand.reprompt)
        .withSimpleCard(help.cardtitle.replace('<speak>', '').replace('</speak>', ''),
          help.cardtext.replace('<speak>', '').replace('</speak>', ''))
        .getResponse();
    }
  },
};

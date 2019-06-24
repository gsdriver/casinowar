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
    const game = attributes[attributes.currentGame];

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
    } else if (game.dealer.length && game.player.length) {
      const hand = await utils.readHand(handlerInput, true);
      const help = await voicehub
        .intent('AMAZON.HelpIntent')
        .post('HelpResponse')
        .withParameters({
          minbet: game.rules.minBet,
          maxbet: game.rules.maxBet,
          handtext: hand.speech,
          handreprompt: ' ',
        })
        .get();

      return handlerInput.responseBuilder
        .speak(help.speech + hand.reprompt)
        .reprompt(hand.reprompt)
        .withSimpleCard(help.cardtitle.replace('<speak>', '').replace('</speak>', ''),
          help.cardtext.replace('<speak>', '').replace('</speak>', ''))
        .getResponse();
    } else {
      const help = await voicehub
        .intent('AMAZON.HelpIntent')
        .post('HelpResponseNoHand')
        .withParameters({
          minbet: game.rules.minBet,
          maxbet: game.rules.maxBet,
        })
        .get();

      return handlerInput.responseBuilder
        .speak(help.speech)
        .reprompt(help.reprompt)
        .withSimpleCard(help.cardtitle.replace('<speak>', '').replace('</speak>', ''),
          help.cardtext.replace('<speak>', '').replace('</speak>', ''))
        .getResponse();
    }
  },
};

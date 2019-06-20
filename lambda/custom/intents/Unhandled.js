//
// Unhandled intents
//

'use strict';

const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);
const utils = require('../utils');

module.exports = {
  canHandle: function(handlerInput) {
    return true;
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    voicehub.setLocale(handlerInput);
    const post = await voicehub
      .intent('UnknownIntent')
      .post(utils.atWar(attributes) ? 'UnknownWar' : 'Unknown')
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

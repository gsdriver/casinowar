//
// Unhandled intents
//

'use strict';

const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle: function(handlerInput) {
    return true;
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;

    voicehub.setLocale(handlerInput);
    const post = await voicehub
      .intent('UnknownIntent')
      .post('Unknown')
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

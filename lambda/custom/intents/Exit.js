//
// Handles stop, which will exit the skill
//

'use strict';

const utils = require('../utils');
const ads = require('../ads');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    // Can always handle with Stop and Cancel
    if (request.type === 'IntentRequest') {
      if ((request.intent.name === 'AMAZON.CancelIntent')
        || (request.intent.name === 'AMAZON.StopIntent')) {
        return true;
      }

      // Can also handle No if said while not at war
      if (request.intent.name === 'AMAZON.NoIntent') {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (!utils.atWar(attributes)) {
          return true;
        }
      }
    }

    return false;
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    voicehub.setLocale(handlerInput);
    if (attributes.bot) {
      const post = await voicehub
        .intent('AMAZON.CancelIntent')
        .post('Exit')
        .withParameters({
          ad: '',
        })
        .get();

      return handlerInput.responseBuilder
        .speak(post.speech)
        .getResponse();
    } else {
      const adText = await ads.getAd(attributes, 'war', event.request.locale);
      const post = await voicehub
        .intent('AMAZON.CancelIntent')
        .post('Exit')
        .withParameters({
          ad: (adText.length ? adText : ' '),
        })
        .get();

      return handlerInput.responseBuilder
        .speak(post.speech)
        .withShouldEndSession(true)
        .getResponse();
    }
  },
};

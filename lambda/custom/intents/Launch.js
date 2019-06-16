//
// Launches the skill
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle: function(handlerInput) {
    return handlerInput.requestEnvelope.session.new ||
      (handlerInput.requestEnvelope.request.type === 'LaunchRequest');
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    // Simple - welcome them to the game and have them bet
    let speech;
    const game = attributes[attributes.currentGame];
    voicehub.setLocale(handlerInput);

    // If we're at war, we need to read the hand as well
    let handText = ' ';
    let reprompt;
    if (!utils.atWar(attributes)) {
      // Read the hand as well
      const hand = await utils.readHand(handlerInput, false);
      handText = hand.speech;
      reprompt = hand.reprompt;
    }

    // Either welcome or welcome back
    const postName = (game.rounds) ? 'WelcomeBack' : 'Welcome';
    const post = await voicehub
      .intent('LaunchRequest')
      .post(postName)
      .withParameters({
        bankroll: game.bankroll,
        hand: handText,
      })
      .get();

    reprompt = reprompt || post.reprompt;
    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(reprompt)
      .getResponse();
  },
};

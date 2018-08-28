//
// Launches the skill
//

'use strict';

const utils = require('../utils');

module.exports = {
  canHandle: function(handlerInput) {
    return handlerInput.requestEnvelope.session.new ||
      (handlerInput.requestEnvelope.request.type === 'LaunchRequest');
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);

    // Simple - welcome them to the game and have them bet
    let speech;
    const game = attributes[attributes.currentGame];

    // Either welcome or welcome back
    if (game.rounds) {
      speech = res.strings.LAUNCH_WELCOME_BACK.replace('{0}', game.bankroll);
    } else {
      speech = res.strings.LAUNCH_WELCOME;
    }

    // Are we playing or at war?
    if (utils.atWar(attributes)) {
      // Read the hand as well
      const hand = utils.readHand(event, attributes, false);
      speech += (hand.speech + hand.reprompt);
      return handlerInput.responseBuilder
        .speak(speech)
        .reprompt(hand.reprompt)
        .getResponse();
    } else {
      const reprompt = res.strings.LAUNCH_REPROMPT;
      speech += reprompt;
      return handlerInput.responseBuilder
        .speak(speech)
        .reprompt(reprompt)
        .getResponse();
    }
  },
};

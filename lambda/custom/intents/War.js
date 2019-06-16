//
// Handles going to War!
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (utils.atWar(attributes) && (request.type === 'IntentRequest')
      && (request.intent.name === 'AMAZON.YesIntent'));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];

    // OK, deal one more card - player wins on ties
    let reprompt;
    let dealtCards = ' ';
    let postName;

    voicehub.setLocale(handlerInput);
    if (game.bankroll < game.bet) {
      postName = 'NotEnough';
    } else {
      if (!game.wars) {
        game.wars = {};
      }
      game.wars.hit = (game.wars.hit + 1) || 1;

      // First burn three
      game.deck.shift();
      game.deck.shift();
      game.deck.shift();

      game.bankroll -= game.bet;
      game.player.push(game.deck.shift());
      game.dealer.push(game.deck.shift());
      dealtCards = await utils.sayDealtCards(handlerInput, game.player[1], game.dealer[1]);

      // OK, who won (player wins ties)
      if (game.player[1].rank >= game.dealer[1].rank) {
        // You won!
        if ((game.player[1].rank == game.dealer[1].rank) &&
            game.rules.tieBonus) {
          postName = 'WarTieWinner';
          game.bankroll += (3 + game.rules.tieBonus) * game.bet;
        } else {
          postName = 'WarWinner';
          game.bankroll += 3 * game.bet;
        }
      } else {
        postName = 'WarLoser';
      }
    }

    const post = await voicehub
      .intent('WarIntent')
      .post(postName)
      .withParameters({
        dealtcards: dealtCards,
        tiebonus: (1 + game.rules.tieBonus) * game.bet,
      })
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

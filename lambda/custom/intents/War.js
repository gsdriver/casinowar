//
// Handles going to War!
//

'use strict';

const utils = require('../utils');

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (utils.atWar(attributes) && (request.type === 'IntentRequest')
      && (request.intent.name === 'AMAZON.YesIntent'));
  },
  handle: function(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const res = require('../resources')(event.request.locale);
    const game = attributes[attributes.currentGame];

    // OK, deal one more card - player wins on ties
    let reprompt;
    let speech;

    if (game.bankroll < game.bet) {
      speech = res.strings.WAR_NOT_ENOUGH;
      reprompt = res.strings.WAR_NOT_ENOUGH_REPROMPT;
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
      speech = utils.sayDealtCards(event, attributes, game.player[1], game.dealer[1]);

      // OK, who won (player wins ties)
      if (game.player[1].rank >= game.dealer[1].rank) {
        // You won!
        if ((game.player[1].rank == game.dealer[1].rank) &&
            game.rules.tieBonus) {
          speech += res.strings.WAR_TIE_WINNER.replace('{0}', (1 + game.rules.tieBonus) * game.bet);
          game.bankroll += (3 + game.rules.tieBonus) * game.bet;
        } else {
          speech += res.strings.BET_WINNER;
          game.bankroll += 3 * game.bet;
        }
      } else {
        speech += res.strings.BET_LOSER;
      }

      reprompt = res.strings.BET_PLAY_AGAIN;
      speech += reprompt;
    }

    handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt);
  },
};

//
// Handles taking a bet and dealing the cards (one shot)
//

'use strict';

const utils = require('../utils');
const seedrandom = require('seedrandom');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (!utils.atWar(attributes) && (request.type === 'IntentRequest')
      && ((request.intent.name === 'BetIntent')
        || (request.intent.name === 'AMAZON.YesIntent')));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let post;
    let postName;

    // The bet amount is optional - if not present we will use a default value
    // of either the last bet amount or the minimum bet
    voicehub.setLocale(handlerInput);
    const output = await utils.getBetAmount(handlerInput);
    if (output.speech) {
      return handlerInput.responseBuilder
        .speak(output.speech)
        .reprompt(output.reprompt)
        .getResponse();
    }

    let reprompt;
    let speech;
    let sideBetPlaced;
    const game = attributes[attributes.currentGame];

    // Place the bet and deal the cards
    const sayBet = (game.bet !== output.amount);
    game.bet = output.amount;
    game.bankroll -= game.bet;

    // Now for the side bet - if we can afford it.  If not, don't bet on this round
    if (game.sideBet && (game.sideBet <= game.bankroll)) {
      game.bankroll -= game.sideBet;
      sideBetPlaced = true;
    }

    game.timestamp = Date.now();
    game.rounds = (game.rounds + 1) || 1;
    game.specialState = undefined;

    // If fewer than 20 cards, shuffle
    if (game.deck.length < 20) {
      utils.shuffleDeck(game, event.session.user.userId);
    }
    game.player = [game.deck.shift()];
    game.dealer = [game.deck.shift()];
    if (process.env.FORCETIE) {
      game.dealer[0].rank = game.player[0].rank;
    }
    speech = await utils.sayDealtCards(handlerInput, game.player[0], game.dealer[0], (sayBet) ? game.bet : undefined);

    // If these are the same rank - you have a war!
    if (game.player[0].rank == game.dealer[0].rank) {
      // If the side bet was placed, let them know it won
      // We have 6 audio files to choose from
      const warSounds = parseInt(process.env.WARCOUNT);
      let warSound = ' ';
      let sideBetWin = ' ';
      postName = 'War';
      if (!isNaN(warSounds) && !attributes.bot) {
        const randomValue = seedrandom(event.session.user.userId + (game.timestamp ? game.timestamp : ''))();
        const choice = 1 + Math.floor(randomValue * warSounds);
        if (choice > warSounds) {
          choice--;
        }
        postParams.warsound = `<audio src="https://s3-us-west-2.amazonaws.com/alexasoundclips/war/war${choice}.mp3"/>`;
        postName += 'Sound';
      }

      if (sideBetPlaced) {
        postName += 'SideBet';
        game.bankroll += 10 * game.sideBet;
        sideBetWin = 10 * game.sideBet;
      }

      post = await voicehub
        .intent('BetIntent')
        .post(postName)
        .withParameters({
          warsound: warSound,
          sidebet: sideBetWin,
        })
        .get();
    } else {
      // OK, who won?
      if (game.player[0].rank > game.dealer[0].rank) {
        // You won!
        postName = 'BetWinner';
        game.bankroll += 2 * game.bet;
      } else {
        postName = 'BetLoser';
      }

      // Reset bankroll if necessary
      if ((game.bankroll < game.rules.minBet) && game.rules.canReset) {
        game.bankroll = game.startingBankroll;
        postName = 'BetBankrupt';
      }

      post = await voicehub
        .intent('BetIntent')
        .post(postName)
        .withParameters({
          bankroll: game.bankroll,
        })
        .get();
    }

    return handlerInput.responseBuilder
      .speak(speech + ' ' + post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

//
// Handles taking a bet and dealing the cards (one shot)
//

'use strict';

const utils = require('../utils');
const seedrandom = require('seedrandom');

module.exports = {
  handleIntent: function() {
    // The bet amount is optional - if not present we will use a default value
    // of either the last bet amount or the minimum bet
    utils.getBetAmount(this, (amount, speechError, repromptError) => {
      if (speechError) {
        utils.emitResponse(this, null, null, speechError, repromptError);
        return;
      }

      let reprompt;
      let speech;
      let sideBetPlaced;
      const game = this.attributes[this.attributes.currentGame];

      // Place the bet and deal the cards
      const sayBet = (game.bet !== amount);
      game.bet = amount;
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
        utils.shuffleDeck(game, this.event.session.user.userId);
      }
      game.player = [game.deck.shift()];
      game.dealer = [game.deck.shift()];
      if (process.env.FORCETIE) {
        game.dealer[0].rank = game.player[0].rank;
      }
      speech = utils.sayDealtCards(this, game.player[0], game.dealer[0],
          (sayBet) ? game.bet : undefined);

      // If these are the same rank - you have a war!
      if (game.player[0].rank == game.dealer[0].rank) {
        this.handler.state = 'ATWAR';

        // If the side bet was placed, let them know it won
        // We have 6 audio files to choose from
        const warSounds = parseInt(process.env.WARCOUNT);
        if (!isNaN(warSounds) && !this.attributes.bot) {
          const randomValue = seedrandom(this.event.session.user.userId + (game.timestamp ? game.timestamp : ''))();
          const choice = 1 + Math.floor(randomValue * warSounds);
          if (choice > warSounds) {
            choice--;
          }
          speech += `<audio src="https://s3-us-west-2.amazonaws.com/alexasoundclips/war/war${choice}.mp3"/> `;
        } else {
          speech += this.t('BET_SAME_CARD');
        }

        if (sideBetPlaced) {
          game.bankroll += 10 * game.sideBet;
          speech += this.t('BET_SAME_CARD_SIDEBET').replace('{0}', 10 * game.sideBet);
        }
        reprompt = this.t('BET_REPROMPT_WAR');
      } else {
        // OK, who won?
        if (game.player[0].rank > game.dealer[0].rank) {
          // You won!
          speech += this.t('BET_WINNER');
          game.bankroll += 2 * game.bet;
        } else {
          speech += this.t('BET_LOSER');
        }

        // Reset bankroll if necessary
        if ((game.bankroll < game.rules.minBet) && game.rules.canReset) {
          game.bankroll = game.startingBankroll;
          speech += this.t('RESET_BANKROLL').replace('{0}', game.bankroll);
        }

        reprompt = this.t('BET_PLAY_AGAIN');
      }
      speech += reprompt;

      utils.emitResponse(this, null, null, speech, reprompt);
    });
  },
};

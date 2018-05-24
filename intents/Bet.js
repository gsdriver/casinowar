//
// Handles taking a bet and dealing the cards (one shot)
//

'use strict';

const utils = require('../utils');

module.exports = {
  handleIntent: function() {
    // The bet amount is optional - if not present we will use a default value
    // of either the last bet amount or the minimum bet
    let reprompt;
    let speech;
    let amount;
    const game = this.attributes[this.attributes.currentGame];
    const amountSlot = this.event.request.intent.slots.Amount;

    // Default to minimum bet
    if (amountSlot && amountSlot.value) {
      // If the bet amount isn't an integer, we'll use the default value (1 unit)
      amount = parseInt(amountSlot.value);
    } else if (game.bet) {
      amount = game.bet;
    } else {
      amount = game.minBet;
    }

    // If we didn't get the amount, just make it a minimum bet
    if (isNaN(amount) || (amount == 0)) {
      amount = game.rules.minBet;
    } else

    if (amount > game.rules.maxBet) {
      speech = this.t('BET_EXCEEDS_MAX').replace('{0}', game.rules.maxBet);
      reprompt = this.t('BET_INVALID_REPROMPT');
    } else if (amount < game.rules.minBet) {
      speech = this.t('BET_LESSTHAN_MIN').replace('{0}', game.rules.minBet);
      reprompt = this.t('BET_INVALID_REPROMPT');
    } else if (amount > game.bankroll) {
      if (game.bankroll >= game.rules.minBet) {
        amount = game.bankroll;
      } else {
        // Oops, you can't bet this much
        speech = this.t('BET_EXCEEDS_BANKROLL').replace('{0}', game.bankroll);
        reprompt = this.t('BET_INVALID_REPROMPT');
      }
    }

    if (speech) {
      utils.emitResponse(this, null, null, speech, reprompt);
      return;
    }

    // Place the bet and deal the cards
    const format = (game.bet == amount) ? this.t('BET_CARDS') : this.t('BET_CARDS_SAYBET');
    game.bet = amount;
    game.bankroll -= game.bet;
    game.timestamp = Date.now();
    game.rounds = (game.rounds + 1) || 1;

    // If fewer than 20 cards, shuffle
    if (game.deck.length < 20) {
      utils.shuffleDeck(game, this.event.session.user.userId);
    }
    game.player = [game.deck.shift()];
    game.dealer = [game.deck.shift()];

    speech = format
        .replace('{0}', utils.sayCard(this, game.player[0]))
        .replace('{1}', utils.sayCard(this, game.dealer[0]))
        .replace('{2}', game.bet);

    // If these are the same rank - you have a war!
    if (game.player[0].rank == game.dealer[0].rank) {
      this.handler.state = 'ATWAR';
      speech += this.t('BET_SAME_CARD');
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
  },
};

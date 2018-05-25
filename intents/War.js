//
// Handles going to War!
//

'use strict';

const utils = require('../utils');

module.exports = {
  handleYesIntent: function() {
    const game = this.attributes[this.attributes.currentGame];

    // OK, deal one more card - player wins on ties
    let reprompt;
    let speech;

    if (game.bankroll < game.bet) {
      speech = this.t('WAR_NOT_ENOUGH');
      reprompt = this.t('WAR_NOT_ENOUGH_REPROMPT');
      utils.emitResponse(this, null, null, speech, reprompt);
      return;
    }

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

    speech = this.t('BET_CARDS')
        .replace('{0}', utils.sayCard(this, game.player[1]))
        .replace('{1}', utils.sayCard(this, game.dealer[1]));

    // OK, who won (player wins ties)
    if (game.player[1].rank >= game.dealer[1].rank) {
      // You won!
      if (game.rules.tieBonus) {
        speech += this.t('WAR_TIE_WINNER').replace('{0}', (1 + game.rules.tieBonus) * game.bet);
        game.bankroll += (3 + game.rules.tieBonus) * game.bet;
      } else {
        speech += this.t('BET_WINNER');
        game.bankroll += 3 * game.bet;
      }
    } else {
      speech += this.t('BET_LOSER');
    }

    reprompt = this.t('BET_PLAY_AGAIN');
    speech += reprompt;
    this.handler.state = 'PLAYING';
    utils.emitResponse(this, null, null, speech, reprompt);
  },
  handleNoIntent: function() {
    const game = this.attributes[this.attributes.currentGame];
    let speech;
    const reprompt = this.t('BET_PLAY_AGAIN');

    if (!game.wars) {
      game.wars = {};
    }
    game.wars.surrender = (game.wars.surrender + 1) || 1;

    // You lose half your bet
    game.bankroll += Math.floor(game.bet / 2);
    game.specialState = 'surrender';
    speech = this.t('WAR_SURRENDER');
    if ((game.bankroll < game.rules.minBet) && game.rules.canReset) {
      game.bankroll = game.startingBankroll;
      speech += this.t('RESET_BANKROLL').replace('{0}', game.bankroll);
    }

    speech += reprompt;
    this.handler.state = 'PLAYING';
    utils.emitResponse(this, null, null, speech, reprompt);
  },
};

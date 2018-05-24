//
// Launches the skill
//

'use strict';

const utils = require('../utils');

module.exports = {
  handleIntent: function() {
    // Simple - welcome them to the game and have them bet
    let speech;
    const game = this.attributes[this.attributes.currentGame];

    // Either welcome or welcome back
    if (game.rounds) {
      speech = this.t('LAUNCH_WELCOME_BACK').replace('{0}', game.bankroll);
    } else {
      speech = this.t('LAUNCH_WELCOME');
    }

    // Are we playing or at war?
    this.handler.state = ((game.player.length == 1) && (game.dealer.length == 1)
      && (game.player[0].rank == game.dealer[0].rank)) ? 'ATWAR' : 'PLAYING';
    utils.emitResponse(this, null, null, speech, this.t('LAUNCH_REPROMPT'));
  },
};

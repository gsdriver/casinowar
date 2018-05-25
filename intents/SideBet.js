//
// Handles the side bet
//

'use strict';

const utils = require('../utils');

module.exports = {
  handlePlaceIntent: function() {
    // The bet amount is optional - if not present we will use a default value
    // of either the last bet amount or the minimum bet
    utils.getBetAmount(this, (amount, speechError, repromptError) => {
      if (speechError) {
        utils.emitResponse(this, null, null, speechError, repromptError);
        return;
      }

      const game = this.attributes[this.attributes.currentGame];
      game.sideBet = amount;
      const speech = this.t('SIDEBET_PLACED').replace('{0}', game.sideBet);
      utils.emitResponse(this, null, null, speech, this.t('SIDEBET_REPROMPT'));
    });
  },
  handleRemoveIntent: function() {
    const game = this.attributes[this.attributes.currentGame];
    game.sideBet = undefined;
    utils.emitResponse(this, null, null, this.t('SIDEBET_REMOVED'), this.t('SIDEBET_REPROMPT'));
  },
};

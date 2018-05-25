//
// Handles help
//

'use strict';

const utils = require('../utils');

module.exports = {
  handleIntent: function() {
    const game = this.attributes[this.attributes.currentGame];

    utils.readHand(this, true, (speech, reprompt) => {
      const help = speech + this.t('HELP_TEXT') + reprompt;
      const helpText = this.t('HELP_CARD_TEXT')
        .replace('{0}', game.rules.minBet)
        .replace('{1}', game.rules.maxBet)
        .replace('{2}', game.rules.minBet)
        .replace('{3}', game.rules.maxBet);

      utils.emitResponse(this, null, null,
              help, reprompt, this.t('HELP_CARD_TITLE'), helpText);
    });
  },
};

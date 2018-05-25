//
// Handles help
//

'use strict';

const utils = require('../utils');

module.exports = {
  handleIntent: function() {
    utils.readHand(this, true, (speech, reprompt) => {
      utils.emitResponse(this, null, null, speech, reprompt);
    });
  },
};

//
// Handles help
//

'use strict';

const utils = require('../utils');

module.exports = {
  handleIntent: function() {
    utils.readHand(this, (speech, reprompt) => {
      utils.emitResponse(this, null, null, speech, reprompt);
    });
  },
};

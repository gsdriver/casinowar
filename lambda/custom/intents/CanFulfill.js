//
// Checks whether we can fulfill this intent
// Note that this is processed outside of the normal Alexa SDK
// So we cannot use alexa-sdk functionality here
//

'use strict';

const AWS = require('aws-sdk');

module.exports = {
  check: function(event, callback) {
    const attributes = {};
    const universalIntents = ['HighScoreIntent', 'AMAZON.RepeatIntent', 'AMAZON.FallbackIntent',
      'AMAZON.HelpIntent', 'AMAZON.YesIntent', 'AMAZON.NoIntent', 'AMAZON.StopIntent',
      'AMAZON.CancelIntent'];

    // Default to a negative response
    const response = {
    'version': '1.0',
      'response': {
        'canFulfillIntent': {
          'canFulfill': 'NO',
          'slots': {},
        },
      },
    };

    // If this is one we understand in any state and regardless of attributes,
    // then we can just return immediately
    if (universalIntents.indexOf(event.request.intent.name) > -1) {
      execute(true);
    } else {
      // OK we're going to have to load state to see if this is valid
      let userId;
      if (event.context && event.context.System && event.context.System.user
        && event.context.System.user.userId) {
        userId = event.context.System.user.userId;
      } else if (event.session && event.session.user && event.session.user.userId) {
        userId = event.session.user.userId;
      }

      if (userId) {
        const doc = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
        doc.get({TableName: 'War',
                ConsistentRead: true,
                Key: {userId: userId}},
                (err, data) => {
          if (err || (data.Item === undefined)) {
            if (err) {
              console.log('Error reading attributes ' + err);
            }
          } else {
            Object.assign(attributes, data.Item.mapAttr);
          }

          execute();
        });
      } else {
        execute();
      }
    }

    function execute(isValid) {
      let game;
      let state;
      let valid = isValid;

      if (!valid) {
        if (attributes.currentGame) {
          game = attributes[attributes.currentGame];
        }

        // WHat is the implied state?
        state = (game && game.player && game.dealer
            && (game.player.length == 1) && (game.dealer.length == 1)
            && (game.player[0].rank == game.dealer[0].rank)
            && (game.specialState !== 'surrender')) ? 'ATWAR' : 'PLAYING';

        // Note that valid ATWAR intents are handled above - unique ones are
        // only available if you are in PLAYING mode
        if (state == 'PLAYING') {
          switch (event.request.intent.name) {
            case 'RemoveSideBetIntent':
              // Yeah, we can do this
              valid = true;
              break;
            case 'PlaceSideBetIntent':
            case 'BetIntent':
              let amount = 0;

              // Need to validate Amount
              if (event.request.intent.slots && event.request.intent.slots.Amount
                && event.request.intent.slots.Amount.value) {
                amount = parseInt(event.request.intent.slots.Amount.value);
              } else if (game && game.bet) {
                amount = game.bet;
              } else {
                amount = 5;  // We may not have game, so assume 5 dollars
              }

              if (isNaN(amount) || (amount == 0)) {
                amount = 5;
              }

              if ((amount >= 5) && (amount <= 1000) && (!game || (amount <= game.bankroll))) {
                // Valid bet
                valid = true;
              }
              break;
            default:
              // We don't know this one
              break;
          }
        }
      }

      if (valid) {
        // We can fulfill it - all slots are good
        let slot;

        response.response.canFulfillIntent.canFulfill = 'YES';
        for (slot in event.request.intent.slots) {
          if (slot) {
            response.response.canFulfillIntent.slots[slot] =
                {'canUnderstand': 'YES', 'canFulfill': 'YES'};
          }
        }
      }

      console.log('CanFulfill: ' + JSON.stringify(response));
      callback(response);
    }
  },
};



//
// Utility functions
//

'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const request = require('request');
const querystring = require('querystring');
const Alexa = require('alexa-sdk');
// utility methods for creating Image and TextField objects
const makeImage = Alexa.utils.ImageUtils.makeImage;
const speechUtils = require('alexa-speech-utils')();
const seedrandom = require('seedrandom');

module.exports = {
  emitResponse: function(context, error, response, speech, reprompt, cardTitle, cardText) {
    const formData = {};

    // Async call to save state and logs if necessary
    if (process.env.SAVELOG) {
      const result = (error) ? error : ((response) ? response : speech);
      formData.savelog = JSON.stringify({
        event: this.event,
        result: result,
      });
    }
    if (response || context.attributes.temp.forceSave) {
      formData.savedb = JSON.stringify({
        userId: context.event.session.user.userId,
        attributes: context.attributes,
      });
    }

    if (formData.savelog || formData.savedb) {
      const params = {
        url: process.env.SERVICEURL + 'war/saveState',
        formData: formData,
      };
      request.post(params, (err, res, body) => {
        if (err) {
          console.log(err);
        }
      });
    }

    if (!process.env.NOLOG) {
      console.log(JSON.stringify(context.event));
    }

    if (error) {
      const res = require('./' + context.event.request.locale + '/resources');
      console.log('Speech error: ' + error);
      context.response.speak(error)
        .listen(res.strings.ERROR_REPROMPT);
    } else if (response) {
      context.response.speak(response);
    } else if (cardTitle) {
      context.response.speak(speech)
        .listen(reprompt)
        .cardRenderer(cardTitle, cardText);
    } else {
      context.response.speak(speech)
        .listen(reprompt);
    }

    buildDisplayTemplate(context, () => {
      context.emit(':responseReady');
    });
  },
  initializeGame: function(context, game) {
    context.attributes.currentGame = game;
    const newGame = {
      startingBankroll: 5000,
      bankroll: 5000,
      rules: {
        minBet: 5,              // Minimum bet
        maxBet: 1000,           // Maximum bet
        numberOfDecks: 6,       // Number of decks
        canReset: true,         // Can the game be reset
      },
      player: [],
      dealer: [],
    };

    module.exports.shuffleDeck(newGame, context.event.session.user.userId);
    context.attributes[context.attributes.currentGame] = newGame;
  },
  readLeaderBoard: function(context, callback) {
    const attributes = context.attributes;
    const game = attributes[attributes.currentGame];
    let leaderURL = process.env.SERVICEURL + 'war/leaders';
    let speech = '';
    const params = {};

    params.userId = context.event.session.user.userId;
    params.score = game.bankroll;
    params.game = attributes.currentGame;

    const paramText = querystring.stringify(params);
    if (paramText.length) {
      leaderURL += '?' + paramText;
    }

    request(
      {
        uri: leaderURL,
        method: 'GET',
        timeout: 1000,
      }, (err, response, body) => {
      if (err) {
        // No scores to read
        speech = context.t('LEADER_NO_SCORES');
      } else {
        const leaders = JSON.parse(body);

        if (!leaders.count || !leaders.top) {
          // Something went wrong
          speech = context.t('LEADER_NO_SCORES');
        } else {
          if (leaders.rank) {
            speech += context.t('LEADER_BANKROLL_RANKING')
              .replace('{0}', game.bankroll)
              .replace('{1}', leaders.rank)
              .replace('{2}', roundPlayers(context, leaders.count));
          }

          // And what is the leader board?
          let topScores = leaders.top;
          topScores = topScores.map((x) => context.t('LEADER_BANKROLL_FORMAT').replace('{0}', x));
          speech += context.t('LEADER_TOP_BANKROLLS').replace('{0}', topScores.length);
          speech += speechUtils.and(topScores, {locale: context.event.request.locale, pause: '300ms'});
        }
      }

      callback(speech);
    });
  },
  shuffleDeck: function(game, userId) {
    let i;
    let rank;

    game.deck = [];
    const suits = ['C', 'D', 'H', 'S'];
    for (i = 0; i < game.rules.numberOfDecks; i++) {
      for (rank = 2; rank <= 14; rank++) {
        suits.map((item) => {
          game.deck.push({'rank': rank, 'suit': item});
        });
      }
    }

    // OK, let's shuffle the deck - we'll do this by going thru
    // 10 * number of cards times, and swap random pairs each iteration
    // Yeah, there are probably more elegant solutions but this should do the job
    for (i = 0; i < game.rules.numberOfDecks * 520; i++) {
      const randomValue1 = seedrandom(i + userId + (game.timestamp ? game.timestamp : ''))();
      const randomValue2 = seedrandom('A' + i + userId + (game.timestamp ? game.timestamp : ''))();
      const card1 = Math.floor(randomValue1 * game.deck.length);
      const card2 = Math.floor(randomValue2 * game.deck.length);
      if (card1 == game.deck.length) {
        card1--;
      }
      if (card2 == game.deck.length) {
        card2--;
      }
      const tempCard = game.deck[card1];

      game.deck[card1] = game.deck[card2];
      game.deck[card2] = tempCard;
    }
  },
  sayCard: function(context, card) {
    const suits = JSON.parse(context.t('CARD_SUITS'));
    const ranks = context.t('CARD_RANKS').split('|');

    return context.t('CARD_NAME')
      .replace('{0}', ranks[card.rank - 1])
      .replace('{1}', suits[card.suit]);
  },
  readHand: function(context, readBankroll, callback) {
    let speech = '';
    let reprompt;
    const game = context.attributes[context.attributes.currentGame];

    if (readBankroll) {
      speech += context.t('READ_BANKROLL').replace('{0}', game.bankroll);
    }
    if (context.handler.state == 'ATWAR') {
      // Repeat what they have
      speech += context.t('READ_CARDS')
        .replace('{0}', module.exports.sayCard(context, game.player[0]))
        .replace('{1}', module.exports.sayCard(context, game.dealer[0]));
      reprompt = context.t('BET_REPROMPT_WAR');
    } else if (game.player.length) {
      // Repeat what they had
      speech += context.t('READ_OLD_CARDS')
        .replace('{0}', module.exports.sayCard(context, game.player[game.player.length - 1]))
        .replace('{1}', module.exports.sayCard(context, game.dealer[game.dealer.length - 1]));
      reprompt = context.t('BET_PLAY_AGAIN');
    }

    speech += reprompt;
    callback(speech, reprompt);
  },
};

function buildDisplayTemplate(context, callback) {
  if (context.event.context &&
      context.event.context.System.device.supportedInterfaces.Display) {
    context.attributes.display = true;
    const start = Date.now();
    const game = context.attributes[context.attributes.currentGame];
    let nextCards;

    if ((game.player.length !== 1) || (game.player[0].rank !== game.dealer[0].rank)) {
      nextCards = game.deck.slice(0, 2);
    } else {
      // We're going to burn three if there is a war (assume so)
      nextCards = game.deck.slice(3, 5);
    }

    const formData = {
      dealer: JSON.stringify(game.dealer),
      player: JSON.stringify(game.player),
      nextCards: JSON.stringify(nextCards),
    };
    if (game.activePlayer == 'none') {
      formData.showHoleCard = 'true';
    }

    const params = {
      url: process.env.SERVICEURL + 'war/drawImage',
      formData: formData,
      timeout: 3000,
    };

    request.post(params, (err, res, body) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        const imageUrl = JSON.parse(body).file;
        const end = Date.now();
        console.log('Drawing table took ' + (end - start) + ' ms');

        // Use this as the background image
        const builder = new Alexa.templateBuilders.BodyTemplate6Builder();
        const template = builder.setTitle('')
                    .setBackgroundImage(makeImage(imageUrl))
                    .setBackButtonBehavior('HIDDEN')
                    .build();

        context.response.renderTemplate(template);
        callback();
      }
    });
  } else {
    // Not a display device
    callback();
  }
}

function roundPlayers(context, playerCount) {
  if (playerCount < 200) {
    return playerCount;
  } else {
    // "Over" to the nearest hundred
    return context.t('MORE_THAN_PLAYERS').replace('{0}', 100 * Math.floor(playerCount / 100));
  }
}

//
// Utility functions
//

'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const request = require('request');
const querystring = require('querystring');
const speechUtils = require('alexa-speech-utils')();
const seedrandom = require('seedrandom');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  initializeGame: function(event, attributes, game) {
    attributes.currentGame = game;
    const newGame = {
      startingBankroll: 5000,
      bankroll: 5000,
      rules: {
        minBet: 5,              // Minimum bet
        maxBet: 1000,           // Maximum bet
        numberOfDecks: 6,       // Number of decks
        tieBonus: 1,            // Additional amount paid on tie after war
        canReset: true,         // Can the game be reset
      },
      player: [],
      dealer: [],
    };

    module.exports.shuffleDeck(newGame, event.session.user.userId);
    attributes[attributes.currentGame] = newGame;
  },
  readLeaderBoard: function(handlerInput, callback) {
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];
    const res = require('./resources')(event.request.locale);
    let leaderURL = process.env.SERVICEURL + 'war/leaders';
    let speech = '';
    const params = {};

    params.userId = event.session.user.userId;
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
        speech = res.strings.LEADER_NO_SCORES;
      } else {
        const leaders = JSON.parse(body);

        if (!leaders.count || !leaders.top) {
          // Something went wrong
          speech = res.strings.LEADER_NO_SCORES;
        } else {
          if (leaders.rank) {
            speech += res.strings.LEADER_BANKROLL_RANKING
              .replace('{0}', game.bankroll)
              .replace('{1}', leaders.rank)
              .replace('{2}', roundPlayers(event, leaders.count));
          }

          // And what is the leader board?
          let topScores = leaders.top;
          topScores = topScores.map((x) => res.strings.LEADER_BANKROLL_FORMAT.replace('{0}', x));
          speech += res.strings.LEADER_TOP_BANKROLLS.replace('{0}', topScores.length);
          speech += speechUtils.and(topScores, {locale: event.request.locale, pause: '300ms'});
        }
      }

      callback(speech);
    });
  },
  shuffleDeck: function(game, userId) {
    let i;
    let rank;
    const start = Date.now();

    game.deck = [];
    const suits = ['C', 'D', 'H', 'S'];
    for (i = 0; i < game.rules.numberOfDecks; i++) {
      for (rank = 2; rank <= 14; rank++) {
        suits.map((item) => {
          game.deck.push({'rank': rank, 'suit': item});
        });
      }
    }

    // Shuffle using the Fisher-Yates algorithm
    for (i = 0; i < game.deck.length - 1; i++) {
      const randomValue = seedrandom(i + userId + (game.timestamp ? game.timestamp : ''))();
      let j = Math.floor(randomValue * (game.deck.length - i));
      if (j == (game.deck.length - i)) {
        j--;
      }
      j += i;
      const tempCard = game.deck[i];
      game.deck[i] = game.deck[j];
      game.deck[j] = tempCard;
    }

    console.log('Shuffle took ' + (Date.now() - start) + ' ms');
  },
  async sayCard(handlerInput, card) {
    voicehub.setLocale(handlerInput);
    const post = await voicehub
      .intent('Utilities')
      .post('CardName')
      .get();

    let index = card.rank % 13;
    if (index === 0) {
      index = 13;
    }
    index += ('CDHS'.indexOf(card.suit) * 13);
    index--;

    console.log(card, index, post.card[index].replace('<speak>', '').replace('</speak>', ''));
    return post.card[index].replace('<speak>', '').replace('</speak>', '');
  },
  async readHand(handlerInput, readBankroll) {
    let speech = '';
    let reprompt = '';
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];
    let postName;
    let playerCard;
    let dealerCard;

    // Post to read depends on whether to read bankroll
    // and whether they are at war or not\
    if (module.exports.atWar(attributes)) {
      postName = (readBankroll) ? 'ReadHandBankrollWar' : 'ReadHandWar';
      playerCard = game.player[0];
      dealerCard = game.dealer[0];
    } else {
      postName = (readBankroll) ? 'ReadHandBankroll' : 'ReadHand';
      playerCard = game.player[game.player.length - 1];
      dealerCard = game.dealer[game.dealer.length - 1];
    }

    voicehub.setLocale(handlerInput);
    const card1 = await module.exports.sayCard(handlerInput, playerCard);
    const card2 = await module.exports.sayCard(handlerInput, dealerCard);
    const post = await voicehub
      .intent('Utilities')
      .post(postName)
      .withParameters({
        Bankroll: game.bankroll,
        PlayerCard: card1,
        DealerCard: card2,
      })
      .get();

    const s = post.speech.replace('<speak>', '').replace('</speak>', '');
    const r = post.reprompt.replace('<speak>', '').replace('</speak>', '');
    return {speech: s, reprompt: r};
  },
  sayDealtCards: function(event, attributes, playerCard, dealerCard, bet) {
    const res = require('./resources')(event.request.locale);
    const format = (bet ? res.strings.BET_CARDS_SAYBET : res.strings.BET_CARDS);
    let playerText;
    let dealerText;

    if (playerCard.rank > 10) {
      playerText = module.exports.pickRandomOption(event, attributes, 'GOOD_PLAYER_CARD');
    } else if (playerCard.rank < 5) {
      playerText = module.exports.pickRandomOption(event, attributes, 'BAD_PLAYER_CARD');
    } else {
      playerText = module.exports.pickRandomOption(event, attributes, 'NORMAL_PLAYER_CARD');
    }

    if ((dealerCard.rank > playerCard.rank) && (playerCard.rank > 10)) {
      dealerText = module.exports.pickRandomOption(event, attributes, 'DEALER_TOUGH_BEAT');
    } else {
      dealerText = module.exports.pickRandomOption(event, attributes, 'DEALER_CARD');
    }

    return format
        .replace('{0}', playerText.replace('{0}', module.exports.sayCard(event, playerCard)))
        .replace('{1}', dealerText.replace('{0}', module.exports.sayCard(event, dealerCard)))
        .replace('{2}', bet);
  },
  getBetAmount: function(event, attributes) {
    let reprompt;
    let speech;
    let amount;
    const game = attributes[attributes.currentGame];
    const res = require('./resources')(event.request.locale);

    if (event.request.intent.slots && event.request.intent.slots.Amount
      && event.request.intent.slots.Amount.value) {
      amount = parseInt(event.request.intent.slots.Amount.value);
    } else if (game.bet) {
      amount = game.bet;
    } else {
      amount = game.minBet;
    }

    // If we didn't get the amount, just make it a minimum bet
    if (isNaN(amount) || (amount == 0)) {
      amount = game.rules.minBet;
    }

    if (amount > game.rules.maxBet) {
      speech = res.strings.BET_EXCEEDS_MAX.replace('{0}', game.rules.maxBet);
      reprompt = res.strings.BET_INVALID_REPROMPT;
    } else if (amount < game.rules.minBet) {
      speech = res.strings.BET_LESSTHAN_MIN.replace('{0}', game.rules.minBet);
      reprompt = res.strings.BET_INVALID_REPROMPT;
    } else if (amount > game.bankroll) {
      if (game.bankroll >= game.rules.minBet) {
        amount = game.bankroll;
      } else {
        // Oops, you can't bet this much
        speech = res.strings.BET_EXCEEDS_BANKROLL.replace('{0}', game.bankroll);
        reprompt = res.strings.BET_INVALID_REPROMPT;
      }
    }

    return {amount: amount, speech: speech, reprompt: reprompt};
  },
  pickRandomOption: function(event, attributes, value) {
    const game = attributes[attributes.currentGame];
    const res = require('./resources')(event.request.locale);

    if (res && res.strings[value]) {
      const options = res.strings[value].split('|');
      const randomValue = seedrandom(event.session.user.userId + (game.timestamp ? game.timestamp : ''))();
      const choice = Math.floor(randomValue * options.length);
      if (choice == options.length) {
        choice--;
      }

      return options[choice];
    } else {
      return undefined;
    }
  },
  atWar: function(attributes) {
    const game = attributes[attributes.currentGame];
    return ((game.player.length == 1) && (game.dealer.length == 1)
      && (game.player[0].rank == game.dealer[0].rank)
      && (game.specialState !== 'surrender'));
  },
  drawTable: function(handlerInput, callback) {
    const response = handlerInput.responseBuilder;
    const event = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    if (event.context && event.context.System &&
      event.context.System.device &&
      event.context.System.device.supportedInterfaces &&
      event.context.System.device.supportedInterfaces.Display) {
      attributes.display = true;
      const start = Date.now();
      const game = attributes[attributes.currentGame];
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

          response.addRenderTemplateDirective({
            type: 'BodyTemplate6',
            backButton: 'HIDDEN',
            backgroundImage: {sources: [{url: imageUrl, widthPixels: 0, heightPixels: 0}]},
            title: '',
          });

          callback();
        }
      });
    } else {
      // Not a display device
      callback();
    }
  },
};

function roundPlayers(event, playerCount) {
  const res = require('./resources')(event.request.locale);
  if (playerCount < 200) {
    return playerCount;
  } else {
    // "Over" to the nearest hundred
    return res.strings.MORE_THAN_PLAYERS.replace('{0}', 100 * Math.floor(playerCount / 100));
  }
}

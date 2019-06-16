//
// Reads the top high scores
//

'use strict';

const utils = require('../utils');
const voicehub = require('@voicehub/voicehub')(process.env.VOICEHUB_APPID, process.env.VOICEHUB_APIKEY);

module.exports = {
  canHandle: function(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return ((request.type === 'IntentRequest') && (request.intent.name === 'HighScoreIntent'));
  },
  async handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const leaders = await utils.readLeaderBoard(handlerInput);
    let postName;
    let i;
    const params = {};
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const game = attributes[attributes.currentGame];

    voicehub.setLocale(handlerInput);
    if (!leaders || !leaders.count || !leaders.top) {
      // Something went wrong
      const post = await voicehub
        .intent('HighScoreIntent')
        .post('NoScores')
        .get();

      return handlerInput.responseBuilder
        .speak(post.speech)
        .reprompt(post.reprompt)
        .getResponse();
    }

    if (leaders.rank) {
      postName = 'LeaderRank';
      params.bankroll = game.bankroll;
      params.rank = '<say-as interpret-as="ordinal">' + leaders.rank + '</say-as>';
      if (leaders.count < 200) {
        params.players = leaders.count;
      } else {
        postName = 'LeaderRankOver';
        params.players = 100 * Math.floor(leaders.count / 100);
      }
    } else {
      postName = 'LeaderNoRank';
      params.bankroll = ' ';
      params.rank = ' ';
      params.players = ' ';
    }

    // And what is the leader board?
    let topScores = leaders.top;
    for (i = 0; i < 5; i++) {
      params['highscore' + i] = (i < topScores.length) ? topScores[i] : ' ';
    }
    params.totaltop = topScores.length;

    const post = await voicehub
      .intent('HighScoreIntent')
      .post(postName)
      .withParameters(params)
      .get();

    return handlerInput.responseBuilder
      .speak(post.speech)
      .reprompt(post.reprompt)
      .getResponse();
  },
};

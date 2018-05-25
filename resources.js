// Localized resources

const resources = {
  'en-US': {
    'translation': {
      // From index.js
      'UNKNOWN_INTENT': 'Sorry, I didn\'t get that. Try saying Help.',
      'UNKNOWN_INTENT_REPROMPT': 'Try saying Help.',
      // From Bet.js
      'BET_INVALID_AMOUNT': 'I\'m sorry, {0} is not a valid amount to bet.',
      'BET_INVALID_REPROMPT': 'What else can I help you with?',
      'BET_EXCEEDS_MAX': 'Sorry, this bet exceeds the maximum bet of ${0}.',
      'BET_LESSTHAN_MIN': 'Sorry, this bet is less than the minimum bet of ${0}.',
      'BET_EXCEEDS_BANKROLL': 'Sorry, this bet exceeds your bankroll of ${0}.',
      'BET_CARDS_SAYBET': 'You bet ${2} <break time=\'300ms\'/> You got {0} and the dealer got {1}. ',
      'BET_CARDS': 'You got {0} and the dealer got {1}. ',
      'BET_SAME_CARD': 'It\'s a tie! ',
      'BET_WINNER': 'You won! ',
      'BET_LOSER': 'You lose! ',
      'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
      'BET_PLAY_AGAIN': 'Would you like to play again? ',
      'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
      // From Exit.js
      'EXIT_GAME': '{0} Goodbye.',
      // From HighScore.js
      'HIGHSCORE_REPROMPT': 'What else can I help you with?',
      // From Launch.js
      'LAUNCH_WELCOME': 'Welcome to Casino War. ',
      'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have ${0}. ',
      'LAUNCH_REPROMPT': 'Say bet to play.',
      // From Repeat.js
      'READ_BANKROLL': 'You have ${0}. ',
      'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
      'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
      // From War.js
      'WAR_SURRENDER': 'You surrender half your bet. ',
      'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
      'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
      // From utils.js
      'MORE_THAN_PLAYERS': 'over {0}',
      'GENERIC_REPROMPT': 'What else can I help with?',
      'LEADER_NO_SCORES': 'Sorry, I\'m unable to read the current leader board',
      'LEADER_BANKROLL_RANKING': 'You have ${0} ranking you as <say-as interpret-as="ordinal">{1}</say-as> of {2} players. ',
      'LEADER_BANKROLL_FORMAT': '${0}',
      'LEADER_TOP_BANKROLLS': 'The top {0} bankrolls are ',
      'CARD_RANKS': 'one|two|three|four|five|six|seven|eight|nine|ten|jack|queen|king|ace',
      'CARD_SUITS': '{"C":"clubs","D":"diamonds","H":"hearts","S":"spades"}',
      'CARD_NAME': '{0} of {1}',
    },
  },
};

module.exports = {
  languageStrings: resources,
};

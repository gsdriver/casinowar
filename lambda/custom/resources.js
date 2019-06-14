// Localized resources

// Shared between all languages
const common = {
  // From index.js
  'UNKNOWN_INTENT': 'Sorry, I didn\'t get that. Try saying Help.',
  'UNKNOWN_INTENT_REPROMPT': 'Try saying Help.',
  // From Bet.js
  'BET_WINNER': 'You won! ',
  'BET_LOSER': 'You lose! ',
  'BET_PLAY_AGAIN': 'Would you like to play again? ',
  // From Exit.js
  'EXIT_GAME': '{0} Goodbye.',
  // From HighScore.js
  'HIGHSCORE_REPROMPT': 'What else can I help you with?',
  // From SideBet.js
  'SIDEBET_REMOVED': 'Side bet removed. ',
  'SIDEBET_REPROMPT': 'Say bet to play.',
  // From War.js
  'WAR_SURRENDER': 'You surrender half your bet. ',
  'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
  'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
  // From utils.js
  'MORE_THAN_PLAYERS': 'over {0}',
  'GENERIC_REPROMPT': 'What else can I help with?',
  'LEADER_NO_SCORES': 'Sorry, I\'m unable to read the current leader board',
  'LEADER_TOP_BANKROLLS': 'The top {0} bankrolls are ',
  'CARD_RANKS': 'one|two|three|four|five|six|seven|eight|nine|ten|jack|queen|king|ace',
  'CARD_SUITS': '{"C":"clubs","D":"diamonds","H":"hearts","S":"spades"}',
  'CARD_NAME': '{0} of {1}',
};

// Used for dollar-specific languages
const dollar = {
  // From Bet.js
  'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
  // From Repeat.js
  'READ_BANKROLL': 'You have ${0}. ',
  // From Sidebet.js
  'SIDEBET_PLACED': '${0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
  // From War.js
  'WAR_TIE_WINNER': 'It\'s another tie - you win ${0}! ',
  // From utils.js
  'LEADER_BANKROLL_RANKING': 'You have ${0} ranking you as <say-as interpret-as="ordinal">{1}</say-as> of {2} players. ',
  'LEADER_BANKROLL_FORMAT': '${0}',
};

// Same strings as above but with £
const pound = {
  // From Bet.js
  'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to £{0}. ',
  // From Repeat.js
  'READ_BANKROLL': 'You have £{0}. ',
  // From Sidebet.js
  'SIDEBET_PLACED': '£{0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
  // From War.js
  'WAR_TIE_WINNER': 'It\'s another tie - you win £{0}! ',
  // From utils.js
  'LEADER_BANKROLL_RANKING': 'You have £{0} ranking you as <say-as interpret-as="ordinal">{1}</say-as> of {2} players. ',
  'LEADER_BANKROLL_FORMAT': '£{0}',
};

// Informal strings - using me and I
const informal = {
  // From Repeat.js
  'READ_CARDS': 'You have {0} and I have {1}. You are at war. ',
  'READ_OLD_CARDS': 'You had {0} and I had {1}. ',
};

// Formal strings - calling out the dealer in third person
const formal = {
  // From Repeat.js
  'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
  'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
};

const resources = {
  'en-US': {
    'translation': Object.assign({}, common, informal, dollar),
  },
  'en-IN': {
    'translation': Object.assign({}, common, formal, dollar),
  },
  'en-GB': {
    'translation': Object.assign({}, common, formal, pound),
  },
};

const utils = (locale) => {
  let translation;
  if (resources[locale]) {
    translation = resources[locale].translation;
  } else {
    translation = resources['en-US'].translation;
  }

  return {
    strings: translation,
  };
};

module.exports = utils;

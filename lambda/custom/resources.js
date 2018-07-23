// Localized resources

// Shared between all languages
const common = {
  // From index.js
  'UNKNOWN_INTENT': 'Sorry, I didn\'t get that. Try saying Help.',
  'UNKNOWN_INTENT_REPROMPT': 'Try saying Help.',
  // From Bet.js
  'BET_INVALID_AMOUNT': 'I\'m sorry, {0} is not a valid amount to bet.',
  'BET_INVALID_REPROMPT': 'What else can I help you with?',
  'BET_CARDS': '<audio src=\"https://s3-us-west-2.amazonaws.com/alexasoundclips/dealcard.mp3\"/> {0} <audio src=\"https://s3-us-west-2.amazonaws.com/alexasoundclips/dealcard.mp3\"/> and {1}. ',
  'BET_SAME_CARD': 'It\'s a tie! ',
  'BET_WINNER': 'You won! ',
  'BET_LOSER': 'You lose! ',
  'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
  'BET_PLAY_AGAIN': 'Would you like to play again? ',
  // From Exit.js
  'EXIT_GAME': '{0} Goodbye.',
  // From Help.js
  'HELP_TEXT': 'Refer to the Alexa app for the full rules of the game. ',
  'HELP_CARD_TITLE': 'Casino War',
  'HELP_BOT_COMMANDS': 'Try sending me these messages:\n\n - "deal" to deal the cards\n - "place a tie bet" to bet that the next round will be a tie (pays 10:1)\n - "read high scores" to read the leader board',
  // From HighScore.js
  'HIGHSCORE_REPROMPT': 'What else can I help you with?',
  // From Launch.js
  'LAUNCH_WELCOME': 'Welcome to Casino War. ',
  'LAUNCH_REPROMPT': 'Say bet to play.',
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
  'BET_EXCEEDS_MAX': 'Sorry, this bet exceeds the maximum bet of ${0}.',
  'BET_LESSTHAN_MIN': 'Sorry, this bet is less than the minimum bet of ${0}.',
  'BET_EXCEEDS_BANKROLL': 'Sorry, this bet exceeds your bankroll of ${0}.',
  'BET_CARDS_SAYBET': 'You bet ${2} <audio src=\"https://s3-us-west-2.amazonaws.com/alexasoundclips/dealcard.mp3\"/> {0} <audio src=\"https://s3-us-west-2.amazonaws.com/alexasoundclips/dealcard.mp3\"/> and {1}. ',
  'BET_SAME_CARD_SIDEBET': 'You won ${0} from your side bet! ',
  'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
  // From Help.js
  'HELP_CARD_TEXT': 'You can bet between ${0} and ${1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from ${2} to ${3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
  // From Launch.js
  'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have ${0}. ',
  // From Repeat.js
  'READ_BET': 'You are betting ${0} a hand. ',
  'READ_BET_AND_SIDEBET': 'You are betting ${0} with a ${1} side bet each hand. ',
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
  'BET_EXCEEDS_MAX': 'Sorry, this bet exceeds the maximum bet of £{0}.',
  'BET_LESSTHAN_MIN': 'Sorry, this bet is less than the minimum bet of £{0}.',
  'BET_EXCEEDS_BANKROLL': 'Sorry, this bet exceeds your bankroll of £{0}.',
  'BET_CARDS_SAYBET': 'You bet £{2} <audio src=\"https://s3-us-west-2.amazonaws.com/alexasoundclips/dealcard.mp3\"/> {0} <audio src=\"https://s3-us-west-2.amazonaws.com/alexasoundclips/dealcard.mp3\"/> and {1}. ',
  'BET_SAME_CARD_SIDEBET': 'You won £{0} from your side bet! ',
  'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to £{0}. ',
  // From Help.js
  'HELP_CARD_TEXT': 'You can bet between £{0} and £{1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from £{2} to £{3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
  // From Launch.js
  'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have £{0}. ',
  // From Repeat.js
  'READ_BET': 'You are betting £{0} a hand. ',
  'READ_BET_AND_SIDEBET': 'You are betting £{0} with a £{1} side bet each hand. ',
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
  // From Bet.js
  'GOOD_PLAYER_CARD': 'You got {0}|You got {0}|Look a {0}|{0} <break time=\'200ms\'/> nice',
  'NORMAL_PLAYER_CARD': 'You got {0}|You got {0}|Here\'s a {0} for you',
  'BAD_PLAYER_CARD': 'You got {0}|You got {0}|{0} <break time=\'400ms\'/> sorry|sorry it\'s a {0}',
  'DEALER_CARD': 'I got {0}|I got {0}|{0} for me',
  'DEALER_TOUGH_BEAT': 'I got {0}|I got {0}|Ouch a {0} for me|{0} for me <break time=\'200ms\'/> close one',
  // From Repeat.js
  'READ_CARDS': 'You have {0} and I have {1}. You are at war. ',
  'READ_OLD_CARDS': 'You had {0} and I had {1}. ',
};

// Formal strings - calling out the dealer in third person
const formal = {
  // From Bet.js
  'GOOD_PLAYER_CARD': 'You got {0}|You got {0}|{0} <break time=\'200ms\'/> nice',
  'NORMAL_PLAYER_CARD': 'You got {0}|You got {0}|Here\'s a {0} for you',
  'BAD_PLAYER_CARD': 'You got {0}|You got {0}|{0} <break time=\'400ms\'/> sorry|sorry it\'s a {0}',
  'DEALER_CARD': 'The dealer got {0}|The dealer got {0}|{0} for the dealer',
  'DEALER_TOUGH_BEAT': 'The dealer got {0}|The dealer got {0}|Ouch a {0} for the dealer|{0} for the dealer <break time=\'200ms\'/> close one',
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

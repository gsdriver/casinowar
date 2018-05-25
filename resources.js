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
      'BET_SAME_CARD_SIDEBET': 'It\'s a tie and you won ${0} from your side bet! ',
      'BET_WINNER': 'You won! ',
      'BET_LOSER': 'You lose! ',
      'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
      'BET_PLAY_AGAIN': 'Would you like to play again? ',
      'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
      // From Exit.js
      'EXIT_GAME': '{0} Goodbye.',
      // From Help.js
      'HELP_TEXT': 'Refer to the Alexa app for the full rules of the game. ',
      'HELP_CARD_TITLE': 'Casino War',
      'HELP_CARD_TEXT': 'You can bet between ${0} and ${1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from ${2} to ${3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
      // From HighScore.js
      'HIGHSCORE_REPROMPT': 'What else can I help you with?',
      // From Launch.js
      'LAUNCH_WELCOME': 'Welcome to Casino War. ',
      'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have ${0}. ',
      'LAUNCH_REPROMPT': 'Say bet to play.',
      // From Repeat.js
      'READ_BET': 'You are betting ${0} a hand. ',
      'READ_BET_AND_SIDEBET': 'You are betting ${0} with a ${1} side bet each hand. ',
      'READ_BANKROLL': 'You have ${0}. ',
      'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
      'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
      // From SideBet.js
      'SIDEBET_PLACED': '${0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
      'SIDEBET_REMOVED': 'Side bet removed. ',
      'SIDEBET_REPROMPT': 'Say bet to play.',
      // From War.js
      'WAR_SURRENDER': 'You surrender half your bet. ',
      'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
      'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
      'WAR_TIE_WINNER': 'It\'s another tie - you win ${0}! ',
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
  'en-AU': {
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
      'BET_SAME_CARD_SIDEBET': 'It\'s a tie and you won ${0} from your side bet! ',
      'BET_WINNER': 'You won! ',
      'BET_LOSER': 'You lose! ',
      'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
      'BET_PLAY_AGAIN': 'Would you like to play again? ',
      'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
      // From Exit.js
      'EXIT_GAME': '{0} Goodbye.',
      // From Help.js
      'HELP_TEXT': 'Refer to the Alexa app for the full rules of the game. ',
      'HELP_CARD_TITLE': 'Casino War',
      'HELP_CARD_TEXT': 'You can bet between ${0} and ${1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from ${2} to ${3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
      // From HighScore.js
      'HIGHSCORE_REPROMPT': 'What else can I help you with?',
      // From Launch.js
      'LAUNCH_WELCOME': 'Welcome to Casino War. ',
      'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have ${0}. ',
      'LAUNCH_REPROMPT': 'Say bet to play.',
      // From Repeat.js
      'READ_BET': 'You are betting ${0} a hand. ',
      'READ_BET_AND_SIDEBET': 'You are betting ${0} with a ${1} side bet each hand. ',
      'READ_BANKROLL': 'You have ${0}. ',
      'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
      'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
      // From SideBet.js
      'SIDEBET_PLACED': '${0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
      'SIDEBET_REMOVED': 'Side bet removed. ',
      'SIDEBET_REPROMPT': 'Say bet to play.',
      // From War.js
      'WAR_SURRENDER': 'You surrender half your bet. ',
      'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
      'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
      'WAR_TIE_WINNER': 'It\'s another tie - you win ${0}! ',
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
  'en-CA': {
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
      'BET_SAME_CARD_SIDEBET': 'It\'s a tie and you won ${0} from your side bet! ',
      'BET_WINNER': 'You won! ',
      'BET_LOSER': 'You lose! ',
      'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
      'BET_PLAY_AGAIN': 'Would you like to play again? ',
      'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
      // From Exit.js
      'EXIT_GAME': '{0} Goodbye.',
      // From Help.js
      'HELP_TEXT': 'Refer to the Alexa app for the full rules of the game. ',
      'HELP_CARD_TITLE': 'Casino War',
      'HELP_CARD_TEXT': 'You can bet between ${0} and ${1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from ${2} to ${3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
      // From HighScore.js
      'HIGHSCORE_REPROMPT': 'What else can I help you with?',
      // From Launch.js
      'LAUNCH_WELCOME': 'Welcome to Casino War. ',
      'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have ${0}. ',
      'LAUNCH_REPROMPT': 'Say bet to play.',
      // From Repeat.js
      'READ_BET': 'You are betting ${0} a hand. ',
      'READ_BET_AND_SIDEBET': 'You are betting ${0} with a ${1} side bet each hand. ',
      'READ_BANKROLL': 'You have ${0}. ',
      'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
      'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
      // From SideBet.js
      'SIDEBET_PLACED': '${0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
      'SIDEBET_REMOVED': 'Side bet removed. ',
      'SIDEBET_REPROMPT': 'Say bet to play.',
      // From War.js
      'WAR_SURRENDER': 'You surrender half your bet. ',
      'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
      'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
      'WAR_TIE_WINNER': 'It\'s another tie - you win ${0}! ',
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
  'en-IN': {
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
      'BET_SAME_CARD_SIDEBET': 'It\'s a tie and you won ${0} from your side bet! ',
      'BET_WINNER': 'You won! ',
      'BET_LOSER': 'You lose! ',
      'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
      'BET_PLAY_AGAIN': 'Would you like to play again? ',
      'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to ${0}. ',
      // From Exit.js
      'EXIT_GAME': '{0} Goodbye.',
      // From Help.js
      'HELP_TEXT': 'Refer to the Alexa app for the full rules of the game. ',
      'HELP_CARD_TITLE': 'Casino War',
      'HELP_CARD_TEXT': 'You can bet between ${0} and ${1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from ${2} to ${3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
      // From HighScore.js
      'HIGHSCORE_REPROMPT': 'What else can I help you with?',
      // From Launch.js
      'LAUNCH_WELCOME': 'Welcome to Casino War. ',
      'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have ${0}. ',
      'LAUNCH_REPROMPT': 'Say bet to play.',
      // From Repeat.js
      'READ_BET': 'You are betting ${0} a hand. ',
      'READ_BET_AND_SIDEBET': 'You are betting ${0} with a ${1} side bet each hand. ',
      'READ_BANKROLL': 'You have ${0}. ',
      'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
      'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
      // From SideBet.js
      'SIDEBET_PLACED': '${0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
      'SIDEBET_REMOVED': 'Side bet removed. ',
      'SIDEBET_REPROMPT': 'Say bet to play.',
      // From War.js
      'WAR_SURRENDER': 'You surrender half your bet. ',
      'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
      'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
      'WAR_TIE_WINNER': 'It\'s another tie - you win ${0}! ',
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
  'en-GB': {
    'translation': {
      // From index.js
      'UNKNOWN_INTENT': 'Sorry, I didn\'t get that. Try saying Help.',
      'UNKNOWN_INTENT_REPROMPT': 'Try saying Help.',
      // From Bet.js
      'BET_INVALID_AMOUNT': 'I\'m sorry, {0} is not a valid amount to bet.',
      'BET_INVALID_REPROMPT': 'What else can I help you with?',
      'BET_EXCEEDS_MAX': 'Sorry, this bet exceeds the maximum bet of £{0}.',
      'BET_LESSTHAN_MIN': 'Sorry, this bet is less than the minimum bet of £{0}.',
      'BET_EXCEEDS_BANKROLL': 'Sorry, this bet exceeds your bankroll of £{0}.',
      'BET_CARDS_SAYBET': 'You bet £{2} <break time=\'300ms\'/> You got {0} and the dealer got {1}. ',
      'BET_CARDS': 'You got {0} and the dealer got {1}. ',
      'BET_SAME_CARD': 'It\'s a tie! ',
      'BET_SAME_CARD_SIDEBET': 'It\'s a tie and you won £{0} from your side bet! ',
      'BET_WINNER': 'You won! ',
      'BET_LOSER': 'You lose! ',
      'BET_REPROMPT_WAR': 'Say yes to go to war or no to surrender. ',
      'BET_PLAY_AGAIN': 'Would you like to play again? ',
      'RESET_BANKROLL': 'You do not have enough to place the minimum bet. Resetting bankroll to £{0}. ',
      // From Exit.js
      'EXIT_GAME': '{0} Goodbye.',
      // From Help.js
      'HELP_TEXT': 'Refer to the Alexa app for the full rules of the game. ',
      'HELP_CARD_TITLE': 'Casino War',
      'HELP_CARD_TEXT': 'You can bet between £{0} and £{1} per round by saying BET and the amount you want to bet.\nYou and the dealer are both dealt one card - high card wins.\nIf it\'s a tie, you can either double your bet and go to war or surrender your hand. If you go to war, the dealer will burn three cards from the deck, then deal a card to both players. High card wins, with the player winning on ties. If you win, you will win your original bet. If the dealer wins, you lose the doubled bet. If you surrender your hand, you lose half your bet and the round ends.\nYou can place a side bet from £{2} to £{3} by saying PLACE SIDE BET. This bet wins if the first two cards are a tie and pays 10-1. The side bet remains in play until you say REMOVE SIDE BET.\nSay READ HIGH SCORES to hear the leader board.\nGood luck!',
      // From HighScore.js
      'HIGHSCORE_REPROMPT': 'What else can I help you with?',
      // From Launch.js
      'LAUNCH_WELCOME': 'Welcome to Casino War. ',
      'LAUNCH_WELCOME_BACK': 'Welcome back to Casino War. You have £{0}. ',
      'LAUNCH_REPROMPT': 'Say bet to play.',
      // From Repeat.js
      'READ_BET': 'You are betting £{0} a hand. ',
      'READ_BET_AND_SIDEBET': 'You are betting £{0} with a £{1} side bet each hand. ',
      'READ_BANKROLL': 'You have £{0}. ',
      'READ_CARDS': 'You have {0} and the dealer has {1}. You are at war. ',
      'READ_OLD_CARDS': 'You had {0} and the dealer had {1}. ',
      // From SideBet.js
      'SIDEBET_PLACED': '£{0} side bet placed which pays ten to one on a tie. The side bet will remain in play until you say remove side bet. ',
      'SIDEBET_REMOVED': 'Side bet removed. ',
      'SIDEBET_REPROMPT': 'Say bet to play.',
      // From War.js
      'WAR_SURRENDER': 'You surrender half your bet. ',
      'WAR_NOT_ENOUGH': 'You don\'t have enough money to place a war bet. Say no to surrender. ',
      'WAR_NOT_ENOUGH_REPROMPT': 'Say no to surrender. ',
      'WAR_TIE_WINNER': 'It\'s another tie - you win £{0}! ',
      // From utils.js
      'MORE_THAN_PLAYERS': 'over {0}',
      'GENERIC_REPROMPT': 'What else can I help with?',
      'LEADER_NO_SCORES': 'Sorry, I\'m unable to read the current leader board',
      'LEADER_BANKROLL_RANKING': 'You have £{0} ranking you as <say-as interpret-as="ordinal">{1}</say-as> of {2} players. ',
      'LEADER_BANKROLL_FORMAT': '£{0}',
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

var mainApp = require('../index');

const attributeFile = 'attributes.txt';

function BuildEvent(argv)
{
  // Templates that can fill in the intent
  const bet = {'name': 'Bet', 'slots': {'Amount': ''}};
  const placesidebet = {'name': 'PlaceSideBet', 'slots': {'Amount': ''}};
  const removesidebet = {'name': 'RemoveSideBetIntent', 'slots': {}};
  const yes = {'name': 'Yes', 'slots': {}};
  const no = {'name': 'No', 'slots': {}};
  const help = {'name': 'Help', 'slots': {}};
  const cancel = {'name': 'Cancel', 'slots': {}};
  const highScore = {'name': 'HighScore', 'slots': {}};
  const repeat = {'name': 'Repeat', 'slots': {}};
  const lambda = {
     "messageVersion": "1.0",
     "invocationSource": "DialogCodeHook",
     "userId": "oxeewxtp27grfq1ob5tpkxhw7a0l5rcg",
     "sessionAttributes": {},
     "requestAttributes": null,
     "bot": {
         "name": "CasinoWar",
         "alias": "$LATEST",
         "version": "$LATEST"
     },
     "outputDialogMode": "Text",
     "currentIntent": {},
     "inputTranscript": "play casino war"
  };

  // If there is an attributes.txt file, read the attributes from there
  const fs = require('fs');
  if (fs.existsSync(attributeFile)) {
    data = fs.readFileSync(attributeFile, 'utf8');
    if (data) {
      lambda.sessionAttributes = JSON.parse(data);
    }
  }

  // If there is no argument, then we'll just return
  if (argv.length <= 2) {
    console.log('I need some parameters');
    return null;
  } else if (argv[2] == 'bet') {
    lambda.currentIntent = bet;
    if (argv.length > 3) {
      bet.slots.Amount = argv[3];
    }
  } else if (argv[2] == 'placesidebet') {
    lambda.currentIntent = placesidebet;
    if (argv.length > 3) {
      placesidebet.slots.Amount = argv[3];
    }
  } else if (argv[2] == 'launch') {
    return openEvent;
  } else if (argv[2] == 'removesidebet') {
    lambda.currentIntent = removesidebet;
  } else if (argv[2] == 'highscore') {
    lambda.currentIntent = highScore;
  } else if (argv[2] == 'help') {
    lambda.currentIntent = help;
  } else if (argv[2] == 'stop') {
    lambda.currentIntent = stop;
  } else if (argv[2] == 'cancel') {
    lambda.currentIntent = cancel;
  } else if (argv[2] == 'reset') {
    lambda.currentIntent = reset;
  } else if (argv[2] == 'repeat') {
    lambda.currentIntent = repeat;
  } else if (argv[2] == 'yes') {
    lambda.currentIntent = yes;
  } else if (argv[2] == 'no') {
    lambda.currentIntent = no;
  } else {
    console.log(argv[2] + ' was not valid');
    return null;
  }

  return lambda;
}

// Simple response - just print out what I'm given
function myResponse(appId) {
  this._appId = appId;
}

myResponse.succeed = function(result) {
  console.log(JSON.stringify(result));
}

myResponse.fail = function(e) {
  console.log(e);
}

// Build the event object and call the app
var event = BuildEvent(process.argv);
if (event) {
    mainApp.handler(event, myResponse, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result.dialogAction.message.content);
        if (result.sessionAttributes) {
          // Output the attributes too
          const fs = require('fs');
          fs.writeFile(attributeFile, JSON.stringify(result.sessionAttributes), (err) => {
            if (!process.env.NOLOG) {
              console.log('attributes:' + JSON.stringify(result.sessionAttributes) + ',');
            }
          });
        }
      }
    });
}
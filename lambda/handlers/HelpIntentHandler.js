const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speech =
      'You can say: next row, go back a row, what row am I on, or reset. ' +
      'For projects: create a project, switch to, list projects, or delete. ' +
      'For reminders: remind me to do something on row number, or list reminders. ' +
      'What would you like to do?';

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt('What would you like to do?')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = HelpIntentHandler;

const NoIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    );
  },
  async handle(handlerInput) {
    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();

    if (sessionAttrs.confirmAction) {
      delete sessionAttrs.confirmAction;
      delete sessionAttrs.confirmProjectName;
      handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

      return handlerInput.responseBuilder
        .speak('Okay, cancelled.')
        .reprompt('Say next row, or ask me anything.')
        .withShouldEndSession(false)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak("I wasn't asking a yes or no question. Say help for options.")
      .reprompt('Say help for options.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = NoIntentHandler;

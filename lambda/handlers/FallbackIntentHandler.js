const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("I didn't catch that. Say next row, or say help for options.")
      .reprompt('Say next row, or say help for options.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = FallbackIntentHandler;

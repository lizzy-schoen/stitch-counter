const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Error handled:', error.message);
    console.error('Error stack:', error.stack);

    return handlerInput.responseBuilder
      .speak('Sorry, something went wrong. Try again.')
      .reprompt('Try again, or say help for options.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = ErrorHandler;

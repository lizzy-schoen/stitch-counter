const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    const { reason } = handlerInput.requestEnvelope.request;
    if (reason === 'ERROR') {
      console.log('Session ended with error:', JSON.stringify(handlerInput.requestEnvelope.request.error));
    }
    return handlerInput.responseBuilder.getResponse();
  },
};

module.exports = SessionEndedRequestHandler;

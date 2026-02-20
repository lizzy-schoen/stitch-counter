const { getActiveProject } = require('../helpers/projectHelper');

const ResetRowIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ResetRowIntent'
    );
  },
  async handle(handlerInput) {
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const project = getActiveProject(attrs);

    if (!project) {
      return handlerInput.responseBuilder
        .speak('No active project. Say create a project, followed by a name.')
        .reprompt('Say create a project, followed by a name.')
        .withShouldEndSession(false)
        .getResponse();
    }

    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    sessionAttrs.confirmAction = 'reset';
    handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

    return handlerInput.responseBuilder
      .speak(`Reset the counter for ${attrs.activeProjectName}? Say yes or no.`)
      .reprompt('Say yes to reset, or no to cancel.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = ResetRowIntentHandler;

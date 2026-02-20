const { getActiveProject } = require('../helpers/projectHelper');

const YesIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    );
  },
  async handle(handlerInput) {
    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();

    if (sessionAttrs.confirmAction === 'reset') {
      const project = getActiveProject(attrs);
      if (project) {
        project.currentRow = 0;
        project.lastModified = new Date().toISOString();
        handlerInput.attributesManager.setPersistentAttributes(attrs);
      }
      delete sessionAttrs.confirmAction;
      handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

      return handlerInput.responseBuilder
        .speak('Reset. Row zero.')
        .reprompt('Say next row to start counting.')
        .withShouldEndSession(false)
        .getResponse();
    }

    if (sessionAttrs.confirmAction === 'delete') {
      const name = sessionAttrs.confirmProjectName;
      delete attrs.projects[name];

      if (attrs.activeProjectName === name) {
        const remaining = Object.keys(attrs.projects);
        attrs.activeProjectName = remaining.length > 0 ? remaining[0] : null;
      }

      handlerInput.attributesManager.setPersistentAttributes(attrs);
      delete sessionAttrs.confirmAction;
      delete sessionAttrs.confirmProjectName;
      handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

      const speech = attrs.activeProjectName
        ? `Deleted ${name}. Switched to ${attrs.activeProjectName}.`
        : `Deleted ${name}.`;

      return handlerInput.responseBuilder
        .speak(speech)
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

module.exports = YesIntentHandler;

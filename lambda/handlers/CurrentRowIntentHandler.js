const { getActiveProject } = require('../helpers/projectHelper');

const CurrentRowIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'CurrentRowIntent'
    );
  },
  async handle(handlerInput) {
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const project = getActiveProject(attrs);

    if (!project) {
      return handlerInput.responseBuilder
        .speak('No active project.')
        .withShouldEndSession(true)
        .getResponse();
    }

    const speech = `Row ${project.currentRow} of ${attrs.activeProjectName}.`;

    return handlerInput.responseBuilder
      .speak(speech)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = CurrentRowIntentHandler;

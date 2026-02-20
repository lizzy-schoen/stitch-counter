const { findClosestProject } = require('../helpers/projectHelper');

const DeleteProjectIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'DeleteProjectIntent'
    );
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const rawName = slots.ProjectName && slots.ProjectName.value;

    if (!rawName) {
      return handlerInput.responseBuilder
        .speak('Which project would you like to delete?')
        .reprompt('Say the name of the project to delete.')
        .addElicitSlotDirective('ProjectName')
        .withShouldEndSession(false)
        .getResponse();
    }

    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const match = findClosestProject(attrs, rawName);

    if (!match) {
      return handlerInput.responseBuilder
        .speak(`I couldn't find a project called ${rawName}. Say list projects to see your projects.`)
        .reprompt('Say list projects to see your projects.')
        .withShouldEndSession(false)
        .getResponse();
    }

    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    sessionAttrs.confirmAction = 'delete';
    sessionAttrs.confirmProjectName = match;
    handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

    return handlerInput.responseBuilder
      .speak(`Delete ${match}? This cannot be undone. Say yes or no.`)
      .reprompt('Say yes to delete, or no to cancel.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = DeleteProjectIntentHandler;

const { normalizeName, findClosestProject } = require('../helpers/projectHelper');

const SwitchProjectIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SwitchProjectIntent'
    );
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const rawName = slots.ProjectName && slots.ProjectName.value;

    if (!rawName) {
      return handlerInput.responseBuilder
        .speak('Which project would you like to switch to?')
        .reprompt('Say the name of the project.')
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

    attrs.activeProjectName = match;
    handlerInput.attributesManager.setPersistentAttributes(attrs);

    const project = attrs.projects[match];

    return handlerInput.responseBuilder
      .speak(`${match}. Row ${project.currentRow}.`)
      .reprompt('Say next row, or ask me anything.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = SwitchProjectIntentHandler;

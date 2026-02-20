const { getActiveProject } = require('../helpers/projectHelper');
const { listUpcoming } = require('../helpers/reminderHelper');

const ListRemindersIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ListRemindersIntent'
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

    const upcoming = listUpcoming(project.reminders, project.currentRow);

    if (upcoming.length === 0) {
      return handlerInput.responseBuilder
        .speak(`No upcoming reminders for ${attrs.activeProjectName}.`)
        .reprompt('Say next row, or ask me anything.')
        .withShouldEndSession(false)
        .getResponse();
    }

    const list = upcoming.map((r) => `Row ${r.row}: ${r.instruction}`);
    const speech =
      upcoming.length === 1
        ? `One upcoming reminder. ${list[0]}.`
        : `${upcoming.length} upcoming reminders. ${list.join('. ')}.`;

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt('Say next row, or ask me anything.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = ListRemindersIntentHandler;

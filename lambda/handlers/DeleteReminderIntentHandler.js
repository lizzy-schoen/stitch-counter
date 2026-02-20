const { getActiveProject } = require('../helpers/projectHelper');

const DeleteReminderIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'DeleteReminderIntent'
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

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const rowNumber = slots.RowNumber && Number(slots.RowNumber.value);

    if (!rowNumber || rowNumber < 1) {
      return handlerInput.responseBuilder
        .speak('Which row number should I remove the reminder for?')
        .reprompt('Say the row number.')
        .withShouldEndSession(false)
        .getResponse();
    }

    if (!project.reminders || !project.reminders[String(rowNumber)]) {
      return handlerInput.responseBuilder
        .speak(`There's no reminder on row ${rowNumber}.`)
        .reprompt('Say next row, or ask me anything.')
        .withShouldEndSession(false)
        .getResponse();
    }

    delete project.reminders[String(rowNumber)];
    project.lastModified = new Date().toISOString();
    handlerInput.attributesManager.setPersistentAttributes(attrs);

    return handlerInput.responseBuilder
      .speak(`Removed reminder for row ${rowNumber}.`)
      .reprompt('Say next row, or ask me anything.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = DeleteReminderIntentHandler;

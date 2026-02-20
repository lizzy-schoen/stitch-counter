const { getActiveProject } = require('../helpers/projectHelper');

const SetRelativeReminderIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SetRelativeReminderIntent'
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

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const rowCount = slots.RowCount && Number(slots.RowCount.value);

    if (!rowCount || rowCount < 1) {
      return handlerInput.responseBuilder
        .speak('I need a number of rows. Say something like, in 3 rows.')
        .withShouldEndSession(true)
        .getResponse();
    }

    const targetRow = project.currentRow + rowCount;

    // Store pending row in session, ask for the instruction
    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    sessionAttrs.pendingReminderRow = targetRow;
    handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

    return handlerInput.responseBuilder
      .speak(`Row ${targetRow}. What should I remind you to do?`)
      .reprompt('What should I remind you to do?')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = SetRelativeReminderIntentHandler;

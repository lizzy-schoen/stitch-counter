const { getActiveProject } = require('../helpers/projectHelper');

const SetReminderIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SetReminderIntent'
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
        .speak('I need a valid row number. Say something like, set a reminder for row 15.')
        .reprompt('Say set a reminder for row, followed by a number.')
        .withShouldEndSession(false)
        .getResponse();
    }

    // Store pending row in session, ask for the instruction
    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    sessionAttrs.pendingReminderRow = rowNumber;
    handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

    return handlerInput.responseBuilder
      .speak(`Row ${rowNumber}. What should I remind you to do?`)
      .reprompt('Say what you need to do on that row. For example, to decrease two stitches.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = SetReminderIntentHandler;

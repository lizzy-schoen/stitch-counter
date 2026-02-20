const { getActiveProject } = require('../helpers/projectHelper');

const CaptureInstructionIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'CaptureInstructionIntent'
    );
  },
  async handle(handlerInput) {
    const sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    const rowNumber = sessionAttrs.pendingReminderRow;

    if (!rowNumber) {
      return handlerInput.responseBuilder
        .speak("I'm not sure what that's for. Say set a reminder for row, followed by a number, to start.")
        .reprompt('Say set a reminder for row, followed by a number.')
        .withShouldEndSession(false)
        .getResponse();
    }

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
    const instruction = slots.ReminderInstruction && slots.ReminderInstruction.value;

    if (!instruction) {
      return handlerInput.responseBuilder
        .speak('I didn\'t catch that. What should I remind you to do?')
        .reprompt('Say what you need to do on that row.')
        .withShouldEndSession(false)
        .getResponse();
    }

    if (!project.reminders) {
      project.reminders = {};
    }

    project.reminders[String(rowNumber)] = instruction;
    project.lastModified = new Date().toISOString();
    handlerInput.attributesManager.setPersistentAttributes(attrs);

    // Clear pending state
    delete sessionAttrs.pendingReminderRow;
    handlerInput.attributesManager.setSessionAttributes(sessionAttrs);

    const pastWarning = rowNumber <= project.currentRow ? ' That row has already passed.' : '';

    return handlerInput.responseBuilder
      .speak(`Got it. Row ${rowNumber}: ${instruction}.${pastWarning}`)
      .reprompt('Say next row, or ask me anything.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = CaptureInstructionIntentHandler;

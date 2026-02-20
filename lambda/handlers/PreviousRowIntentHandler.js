const { getActiveProject } = require('../helpers/projectHelper');
const { buildReminderSpeech } = require('../helpers/reminderHelper');

const PreviousRowIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'PreviousRowIntent'
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

    if (project.currentRow <= 0) {
      return handlerInput.responseBuilder
        .speak("You're already at the beginning.")
        .withShouldEndSession(true)
        .getResponse();
    }

    project.currentRow -= 1;
    project.lastModified = new Date().toISOString();

    const newRow = project.currentRow;
    const parts = [`Back to row ${newRow}.`];

    const reminderSpeech = buildReminderSpeech(project.reminders, newRow);
    if (reminderSpeech) {
      parts.push(`<break time="300ms"/> ${reminderSpeech}`);
    }

    handlerInput.attributesManager.setPersistentAttributes(attrs);

    return handlerInput.responseBuilder
      .speak(parts.join(' '))
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = PreviousRowIntentHandler;

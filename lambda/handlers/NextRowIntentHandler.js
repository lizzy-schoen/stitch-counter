const { getActiveProject } = require('../helpers/projectHelper');
const { buildReminderSpeech } = require('../helpers/reminderHelper');

const NextRowIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'NextRowIntent'
    );
  },
  async handle(handlerInput) {
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const project = getActiveProject(attrs);

    if (!project) {
      return handlerInput.responseBuilder
        .speak('No active project. Say Alexa, tell stitch counter, create a project called, then a name.')
        .withShouldEndSession(true)
        .getResponse();
    }

    project.currentRow = (project.currentRow || 0) + 1;
    project.lastModified = new Date().toISOString();

    const newRow = project.currentRow;
    const parts = [`Row ${newRow}.`];

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

module.exports = NextRowIntentHandler;

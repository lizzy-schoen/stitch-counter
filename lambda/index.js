const Alexa = require('ask-sdk');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');
const { TABLE_NAME } = require('./constants');

// Handlers
const LaunchRequestHandler = require('./handlers/LaunchRequestHandler');
const NextRowIntentHandler = require('./handlers/NextRowIntentHandler');
const PreviousRowIntentHandler = require('./handlers/PreviousRowIntentHandler');
const CurrentRowIntentHandler = require('./handlers/CurrentRowIntentHandler');
const ResetRowIntentHandler = require('./handlers/ResetRowIntentHandler');
const CreateProjectIntentHandler = require('./handlers/CreateProjectIntentHandler');
const SwitchProjectIntentHandler = require('./handlers/SwitchProjectIntentHandler');
const ListProjectsIntentHandler = require('./handlers/ListProjectsIntentHandler');
const DeleteProjectIntentHandler = require('./handlers/DeleteProjectIntentHandler');
const SetReminderIntentHandler = require('./handlers/SetReminderIntentHandler');
const SetRelativeReminderIntentHandler = require('./handlers/SetRelativeReminderIntentHandler');
const CaptureInstructionIntentHandler = require('./handlers/CaptureInstructionIntentHandler');
const ListRemindersIntentHandler = require('./handlers/ListRemindersIntentHandler');
const DeleteReminderIntentHandler = require('./handlers/DeleteReminderIntentHandler');
const YesIntentHandler = require('./handlers/YesIntentHandler');
const NoIntentHandler = require('./handlers/NoIntentHandler');
const HelpIntentHandler = require('./handlers/HelpIntentHandler');
const CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler');
const FallbackIntentHandler = require('./handlers/FallbackIntentHandler');
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler');
const ErrorHandler = require('./handlers/ErrorHandler');

// Interceptors
const LoadPersistentAttributesInterceptor = require('./interceptors/LoadPersistentAttributesInterceptor');
const SavePersistentAttributesInterceptor = require('./interceptors/SavePersistentAttributesInterceptor');

const dynamoDbAdapter = new DynamoDbPersistenceAdapter({
  tableName: TABLE_NAME,
  createTable: false,
  partitionKeyName: 'id',
});

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    NextRowIntentHandler,
    PreviousRowIntentHandler,
    CurrentRowIntentHandler,
    ResetRowIntentHandler,
    CreateProjectIntentHandler,
    SwitchProjectIntentHandler,
    ListProjectsIntentHandler,
    DeleteProjectIntentHandler,
    SetReminderIntentHandler,
    SetRelativeReminderIntentHandler,
    CaptureInstructionIntentHandler,
    ListRemindersIntentHandler,
    DeleteReminderIntentHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LoadPersistentAttributesInterceptor)
  .addResponseInterceptors(SavePersistentAttributesInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(dynamoDbAdapter)
  .withCustomUserAgent('knit-counter/v1.0')
  .lambda();

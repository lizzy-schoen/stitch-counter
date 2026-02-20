const SavePersistentAttributesInterceptor = {
  async process(handlerInput) {
    await handlerInput.attributesManager.savePersistentAttributes();
  },
};

module.exports = SavePersistentAttributesInterceptor;

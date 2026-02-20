const LoadPersistentAttributesInterceptor = {
  async process(handlerInput) {
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();

    if (!attrs.projects) {
      attrs.projects = {};
      attrs.activeProjectName = null;
      handlerInput.attributesManager.setPersistentAttributes(attrs);
    }
  },
};

module.exports = LoadPersistentAttributesInterceptor;

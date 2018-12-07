const { findStageFilePath } = require('../../projectHelpers');
const { StageType } = require('../models');
const { configWriter, fileWriter, configResolver, fileRemove } = require('../../utils/ioHelpers');
const { LOOKUP_KEY, MODEL_DB } = require('../../config');
const { ObjectID } = require('mongodb');
const path = require('path');
const fs = require('fs-extra');
const {
  GraphQLList,
  GraphQLString,
} = require('graphql');

const stageArgs = {
  id: { type: GraphQLString },
  containerId: { type: GraphQLString },
  codeFileIds: { type: new GraphQLList(GraphQLString) },
  title: { type: GraphQLString },
  abiValidations: { type: GraphQLString },
  task: { type: GraphQLString },
  details: { type: GraphQLString },
}

const stageProjectPropNames = {
  abiValidations: 'validations.json',
  task: 'task.md',
  details: 'details.md',
}

module.exports = {
  createStage: {
    type: StageType,
    args: stageArgs,
    async resolve (_, props) {
      props.id = ObjectID().toString();

      const filesToWrite = [];

      const keys = Object.keys(props);
      for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if(stageProjectPropNames[key]) {
          const basePath = await findStageFilePath(props);
          const newPath = path.join(basePath, stageProjectPropNames[key]);
          filesToWrite.push({ path: newPath, contents: props[key] });
          props[key] = LOOKUP_KEY;
        }
      }

      await configWriter(MODEL_DB.STAGES, props);

      // write project files after creation so
      // the sockets config lookup can happen properly
      for(let i = 0; i < filesToWrite.length; i++) {
        const { path, contents } = filesToWrite[i];
        await fileWriter(path, contents);
      }

      return props;
    }
  },
  modifyStage: {
    type: StageType,
    args: stageArgs,
    async resolve (_, props) {
      const stage = await configResolver(MODEL_DB.STAGES, props.id);
      const merged = { ...stage, ...props };

      const newBasePath = await findStageFilePath(merged);
      const previousBasePath = await findStageFilePath(stage);

      // if the title has changed, update the folder name
      if(props.title) {
        fs.rename(previousBasePath, newBasePath)
      }

      const keys = Object.keys(props);
      for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if(stageProjectPropNames[key]) {
          const filePath = path.join(newBasePath, stageProjectPropNames[key]);
          await fileWriter(filePath, merged[key]);
          merged[key] = LOOKUP_KEY;
        }
      }

      return configWriter(MODEL_DB.STAGES, merged);
    }
  },
}
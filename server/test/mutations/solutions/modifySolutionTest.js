const assert = require('assert');
const {
  mutationWrapper,
  SOLUTION_PROJECT_PATH,
  LOOKUP_KEY,
  writtenFiles,
  mockSuite,
} = require('../util');

const modifySolution = mutationWrapper(require('../../../src/schema/mutations/solution/modify'));

const existingSolution = {
  id: 1,
  codeFileId: 2,
  stageId: 3,
  code: LOOKUP_KEY,
}

mockSuite('Mutations::Solutions::Modify', () => {
  const modifyProps = {
    id: existingSolution.id,
    code: "var a = 1",
  }

  let solution;
  before(async () => {
    solution = await modifySolution(modifyProps);
  });

  describe('properties', () => {
    it('should still have a lookup key for code', () => {
      assert.equal(solution.code, LOOKUP_KEY);
    });
  });

  describe('modified files', () => {
    it('should have updated the solution project file', () => {
      assert.equal(writtenFiles[SOLUTION_PROJECT_PATH], modifyProps.code);
    });
  });
});
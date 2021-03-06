import React, { Component } from 'react';
import apiMutation from '../../../utils/api/mutation';
import modifyCodeFile from '../../../mutations/codeFile/modify';
import modifySolution from '../../../mutations/solution/modify';
import { withRouter } from 'react-router-dom';
import UpdateWrapper from '../../UpdateWrapper';
import CodeFileConfig from '../configuration/CodeFileConfig';
import CodeFileEditor from './CodeFileEditor';
import PropsRoute from '../../PropsRoute';
import './CodeFile.scss';

class CodeFile extends Component {
  getCodeFile() {
    const { match: { params: { codeFileId } }, stage } = this.props;
    return stage.codeFiles.find(x => x.id === codeFileId);
  }
  getSolution() {
    const { match: { params: { codeFileId } }, stage } = this.props;
    return stage.solutions.find(x => x.codeFileId === codeFileId);
  }
  updateCode(code) {
    const { id } = this.getCodeFile();
    return apiMutation(modifyCodeFile, { id, initialCode: code });
  }
  updateSolution(code) {
    const { id } = this.getSolution();
    return apiMutation(modifySolution, { id, code });
  }
  renderSolutionRoute() {
    const { stage, match: { url } } = this.props;
    const codeFile = this.getCodeFile();
    if(!codeFile.hasProgress) return null;
    const solution = this.getSolution();
    const { code } = solution;
    const { mode } = codeFile;
    return (
      <PropsRoute path={`${url}/solution`} exact component={UpdateWrapper}
            child={CodeFileEditor} savePromise={({ code }) => this.updateSolution(code)}
            codeFile={codeFile} stage={stage} code={code} mode={mode}
            onUpdate={(code) => this.updateSolution(code)}/>
    )
  }
  render() {
    const { stage, match: { url, params: { codeFileId } } } = this.props;
    const codeFile = this.getCodeFile();
    if(!codeFile) return null;
    const { initialCode, mode } = codeFile;
    return (
      <div className="code-file">
        <PropsRoute path={`${url}/`} exact key={codeFileId} component={UpdateWrapper}
              child={CodeFileEditor} savePromise={({ code }) => this.updateCode(code)}
              codeFile={codeFile} stage={stage} code={initialCode} mode={mode}
              onUpdate={(code) => this.updateCode(code)}/>
        { this.renderSolutionRoute() }
        <PropsRoute path={`${url}/config`} component={UpdateWrapper}
          child={CodeFileConfig} codeFile={codeFile} stage={stage}/>
      </div>
    )
  }
}

export default withRouter(CodeFile);

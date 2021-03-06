import React, { Component } from 'react';
import SaveToolbar from './SaveToolbar';
import SVG from '../../SVG';
import { READ_THE_DOCS } from '../../../config';

class StageConfigToolbar extends Component {
  render() {
    return (
      <React.Fragment>
        <SaveToolbar />
        <li className="docs">
          <a href={`${READ_THE_DOCS}/model_types.html#stages`} target="_blank" rel="noopener noreferrer">
            <SVG name="book" />
            <div> Stage Docs </div>
          </a>
        </li>
      </React.Fragment>
    )
  }
}

export default StageConfigToolbar;

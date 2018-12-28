import React, { Component } from 'react';
import MarkdownToolbar from './MarkdownToolbar';
import SVG from '../../SVG';
import { READ_THE_DOCS } from '../../../config';

class IntroToolbar extends Component {
  render() {
    return (
      <React.Fragment>
        <MarkdownToolbar />
        <li className="docs">
          <a href={`${READ_THE_DOCS}/content.html`} target="_blank">
            <SVG name="book" />
            <div> Markdown Docs </div>
          </a>
        </li>
      </React.Fragment>
    )
  }
}

export default IntroToolbar;

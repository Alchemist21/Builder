import React, { Component } from 'react';
import IntroToolbar from './IntroToolbar';
import PropsRoute from '../../PropsRoute';
import SVG from '../../SVG';
import { Link } from 'react-router-dom';
import './Toolbar.scss';

class Toolbar extends Component {
  render() {
    const { stageContainer } = this.props;
    if(!stageContainer) return null;
    return (
      <ul className="toolbar">
        <li className="logo">
          <Link to="/">
            <SVG name="logotype"/>
          </Link>
        </li>
        <PropsRoute path="/content/:containerId/intro" component={IntroToolbar} stageContainer={stageContainer}/>
      </ul>
    )
  }
}

export default Toolbar;
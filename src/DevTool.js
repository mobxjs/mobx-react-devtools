import React, { Component, PropTypes } from 'react';
import { getGlobalState, restoreState, eventEmitter, _handleMouseMove, _handleClick } from './globalStore';
import Panel from './Panel';
import Highlighter from './Highlighter';
import Graph from './Graph';

export default class DevTool extends Component {

  static propTypes = {
    hightlightTimeout: PropTypes.number,
    position: PropTypes.object,
    userAgent: PropTypes.string,
  };

  componentWillMount() {
    this.setState(getGlobalState());
  }

  componentDidMount() {
    eventEmitter.on('update', this.handleUpdate);
    setTimeout(restoreState, 0);
    if (typeof window !== 'undefined') {
      if (typeof document !== 'undefined') {
        document.body.addEventListener('mousemove', _handleMouseMove, true);
        document.body.addEventListener('click', _handleClick, true);
      }
    }
  }

  componentWillUnmount() {
    eventEmitter.removeListener('update', this.handleUpdate)
    this.renderingMonitor.dispose();
    if (typeof document !== 'undefined') {
      document.body.removeEventListener('mousemove', _handleMouseMove, true);
      document.body.removeEventListener('click', _handleMouseMove, true);
    }
  }

  handleUpdate = () => this.setState(getGlobalState());

  handleToggleGraph = () => {
    this.setState({
      hoverBoxes: [],
      graphEnabled: !this.state.graphEnabled
    });
  };

  render() {
    const { renderingBoxes, hoverBoxes } = this.state;
    return (
      <div>
        <Panel position={this.props.position} />
        <Highlighter boxes={renderingBoxes.concat(hoverBoxes)} />
        <Graph />
      </div>
    );
  }
}



import React, { Component, PropTypes } from 'react';
import RenderingMonitor from '../RenderingMonitor';
import { getGlobalState, setGlobalState, eventEmitter } from '../globalStore';

export default class UpdatesControl extends Component {

  static propTypes = {
    hightlightTimeout: PropTypes.number,
  };

  static defaultProps = {
    hightlightTimeout: 1500,
  };

  componentDidMount() {
    eventEmitter.on('update', this.handleUpdate);
    const { hightlightTimeout } = this.props;
    this.renderingMonitor = new RenderingMonitor({ hightlightTimeout });
  }

  componentWillUnmount() {
    eventEmitter.removeListener('update', this.handleUpdate)
    this.renderingMonitor.dispose();
  }

  handleUpdate = () => this.setState({});

  handleToggleUpdates = () => {
    const { updatesEnabled } = getGlobalState();
    setGlobalState({ updatesEnabled: !updatesEnabled });
  };

  render() {
    const { updatesEnabled } = getGlobalState();
    const { children } = this.props;
    return React.cloneElement(children, {
      onToggle: this.handleToggleUpdates,
      active: updatesEnabled,
    });
  }
}

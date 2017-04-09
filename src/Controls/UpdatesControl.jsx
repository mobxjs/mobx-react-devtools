import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RenderingMonitor from '../RenderingMonitor';
import { getGlobalState, setGlobalState, eventEmitter, restoreUpdatesFromLocalstorage } from '../globalStore';

export default class UpdatesControl extends Component {

  static propTypes = {
    highlightTimeout: PropTypes.number,
  };

  static defaultProps = {
    highlightTimeout: 1500,
  };

  componentDidMount() {
    eventEmitter.on('update', this.handleUpdate);
    const { highlightTimeout } = this.props;
    this.renderingMonitor = new RenderingMonitor({ highlightTimeout });
    restoreUpdatesFromLocalstorage();
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

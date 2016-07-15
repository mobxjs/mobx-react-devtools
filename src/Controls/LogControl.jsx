import React, { Component, PropTypes } from 'react';
import { setLogLevel } from '../changeLogger';
import { getGlobalState, setGlobalState, eventEmitter } from '../globalStore';

export default class LogControl extends Component {

  componentDidMount() {
    eventEmitter.on('update', this.handleUpdate);
  }

  componentWillUnmount() {
    eventEmitter.removeListener('update', this.handleUpdate)
  }

  handleUpdate = () => {
    this.setState({});
    const { logEnabled } = getGlobalState();
    setLogLevel(logEnabled);
  };

  handleToggleLog = () => {
    const { logEnabled } = getGlobalState();
    setGlobalState({ logEnabled: !logEnabled })
  };

  render() {
    const { logEnabled } = getGlobalState();
    const { children } = this.props;
    return React.cloneElement(children, {
      onToggle: this.handleToggleLog,
      active: logEnabled,
    });
  }
}

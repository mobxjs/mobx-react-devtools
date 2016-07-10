import React, { Component, PropTypes } from 'react';
import { setLogLevel } from '../changeLogger';
import { getGlobalState, setGlobalState, eventEmitter } from '../globalStore';

export default class LogControl extends Component {

  componentWillMount() {
    this.setState(getGlobalState());
  }

  componentDidMount() {
    eventEmitter.on('update', this.handleUpdate);
  }

  componentWillUnmount() {
    eventEmitter.removeListener('update', this.handleUpdate)
  }

  handleUpdate = () => this.setState(getGlobalState());

  handleToggleLog = () => {
    const newLevel = !this.state.logEnabled;
    setLogLevel(newLevel);
    setGlobalState({ logEnabled: newLevel });
  };

  render() {
    const { logEnabled } = this.state;
    const { children } = this.props;
    return React.cloneElement(children, {
      onToggle: this.handleToggleLog,
      active: logEnabled,
    });
  }
}

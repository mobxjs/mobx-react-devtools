import React, { Component, PropTypes } from 'react';
import mobxReact from 'mobx-react';
import { getGlobalState, setGlobalState, eventEmitter } from '../globalStore';

export default class GraphControl extends Component {

  componentWillMount() {
    this.setState(getGlobalState());
  }

  componentDidMount() {
    mobxReact.trackComponents();

    eventEmitter.on('update', this.handleUpdate);
  }

  componentWillUnmount() {
    eventEmitter.removeListener('update', this.handleUpdate)
  }

  handleUpdate = () => this.setState(getGlobalState());

  handleToggleGraph = () => {
    setGlobalState({
      hoverBoxes: [],
      graphEnabled: !this.state.graphEnabled
    });
  };

  render() {
    const { graphEnabled } = this.state;
    const { children } = this.props;
    return React.cloneElement(children, {
      onToggle: this.handleToggleGraph,
      active: graphEnabled,
    });
  }
}



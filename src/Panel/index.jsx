import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { eventEmitter } from '../globalStore';
import GraphControl from '../Controls/GraphControl';
import LogControl from '../Controls/LogControl';
import UpdatesControl from '../Controls/UpdatesControl';
import PanelButton from './PanelButton';
import * as styles from './styles';

export default class Panel extends Component {

  static propTypes = {
    highlightTimeout: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    position: 'bottomRight'
  }

  componentDidMount() {
    eventEmitter.on('update', this.handleUpdate);
  }

  componentWillUnmount() {
    eventEmitter.removeListener('update', this.handleUpdate)
  }

  handleUpdate = () => this.setState({});

  render() {
    const { position, highlightTimeout, className, style } = this.props;

    const additionalPanelStyles = {};

    if (typeof position === 'string') {
      switch (position) {
        case 'topRight':
          additionalPanelStyles.top = '-2px';
          additionalPanelStyles.right = '20px';
          break;
        case 'bottomRight':
          additionalPanelStyles.bottom = '-2px';
          additionalPanelStyles.right = '20px';
          break;
        case 'bottomLeft':
          additionalPanelStyles.bottom = '-2px';
          additionalPanelStyles.left = '20px';
          break;
        case 'topLeft':
          additionalPanelStyles.top = '-2px';
          additionalPanelStyles.left = '20px';
          break;
      }
    } else {
      Object.assign(additionalPanelStyles, position);
    }

    return (
      <div>
        <div className={className} style={Object.assign({}, styles.panel, additionalPanelStyles, style)}>
          <UpdatesControl highlightTimeout={highlightTimeout}>
            <PanelButton id={'buttonUpdates'} />
          </UpdatesControl>
          <GraphControl>
            <PanelButton id ={'buttonGraph' } />
          </GraphControl>
          <LogControl>
            <PanelButton id={'buttonLog'} />
          </LogControl>
        </div>
      </div>
    );
  }
};

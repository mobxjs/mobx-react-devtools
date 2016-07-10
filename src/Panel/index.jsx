import React, { Component, PropTypes } from 'react';
import * as styles from './styles';

export default class Panel extends Component {

  static propTypes = {
    logEnabled: PropTypes.bool.isRequired,
    updatesEnabled: PropTypes.bool.isRequired,
    graphEnabled: PropTypes.bool.isRequired,
    onToggleLog: PropTypes.func.isRequired,
    onToggleUpdates: PropTypes.func.isRequired,
    onToggleGraph: PropTypes.func.isRequired,
  };

  state = {
    hoveredButton: undefined
  };

  render() {
    const {
      position,
      logEnabled,
      updatesEnabled,
      graphEnabled,
      onToggleLog,
      onToggleUpdates,
      onToggleGraph,
    } = this.props;
    const { hoveredButton } = this.state;

    const additionalPanelStyles = {};
    if (position) {
      additionalPanelStyles.top = position.top;
      additionalPanelStyles.right = position.right;
      additionalPanelStyles.bottom = position.bottom;
      additionalPanelStyles.left = position.left;
    } else {
      additionalPanelStyles.top = '0px';
      additionalPanelStyles.right = '20px';
    }

    const buttonUpdatesStyles = Object.assign(
      {},
      styles.button,
      updatesEnabled ? styles.buttonUpdatesActive : styles.buttonUpdates,
      updatesEnabled && styles.button.active,
      hoveredButton === 'buttonUpdates' && styles.button.hover
    );

    const buttonGraphStyles = Object.assign(
      {},
      styles.button,
      graphEnabled ? styles.buttonGraphActive : styles.buttonGraph,
      graphEnabled && styles.button.active,
      hoveredButton === 'buttonGraph' && styles.button.hover
    );

    const buttonLogStyles = Object.assign(
      {},
      styles.button,
      logEnabled ? styles.buttonLogActive : styles.buttonLog,
      logEnabled && styles.button.active,
      hoveredButton === 'buttonLog' && styles.button.hover
    );

    return (
      <div>
        <div style={Object.assign({}, styles.panel, additionalPanelStyles)}>
          <button
            title="Visualize component re-renders"
            style={buttonUpdatesStyles}
            key="buttonUpdates"
            onMouseOver={() => this.setState({ hoveredButton: 'buttonUpdates' })}
            onMouseOut={() => this.setState({ hoveredButton: undefined })}
            onClick={onToggleUpdates}
          />
          <button
            title="Select a component and show it's dependency tree"
            style={buttonGraphStyles}
            key="buttonGraph"
            onMouseOver={() => this.setState({ hoveredButton: 'buttonGraph' })}
            onMouseOut={() => this.setState({ hoveredButton: undefined })}
            onClick={onToggleGraph}
          />
          <button
            title="Log all MobX state changes and reactions to the browser console (use F12 to show / hide the console). Use Chrome / Chromium for an optimal experience"
            style={buttonLogStyles}
            key="buttonLog"
            onMouseOver={() => this.setState({ hoveredButton: 'buttonLog' })}
            onMouseOut={() => this.setState({ hoveredButton: undefined })}
            onClick={onToggleLog}
          />
        </div>
      </div>
    );
  }
};

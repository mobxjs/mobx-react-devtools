import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import css from './panel.css';

export default class Panel extends Component {

  static propTypes = {
    logEnabled: PropTypes.bool.isRequired,
    updatesEnabled: PropTypes.bool.isRequired,
    graphEnabled: PropTypes.bool.isRequired,
    onToggleLog: PropTypes.func.isRequired,
    onToggleUpdates: PropTypes.func.isRequired,
    onToggleGraph: PropTypes.func.isRequired,
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

    let styles;
    if (position) {
      styles.top = position.top;
      styles.right = position.right;
      styles.bottom = position.bottom;
      styles.left = position.left;
    } else {
      styles.top = '0px';
      styles.right = '20px';
    }

    return (
      <div>
        <div className={css.panel} style={styles}>
          {/*
           <a
           href="https://mobxjs.github.io/mobx/"
           target="_blank"
           className={css.logo}
           />
           */}
          <button
            title="Visualize component re-renders"
            className={classNames(css.button, css.buttonUpdates, { [css.active]: updatesEnabled })}
            onClick={onToggleUpdates}
          />
          <button
            title="Select a component and show it's dependency tree"
            className={classNames(css.button, css.buttonGraph, { [css.active]: graphEnabled })}
            onClick={onToggleGraph}
          />
          <button
            title="Log all MobX state changes and reactions to the browser console (use F12 to show / hide the console)" 
            className={classNames(css.button, css.buttonLog, { [css.active]: logEnabled })}
            onClick={onToggleLog}
          />
        </div>
      </div>
    );
  }
}

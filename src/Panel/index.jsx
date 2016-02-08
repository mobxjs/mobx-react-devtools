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
      logEnabled,
      updatesEnabled,
      graphEnabled,
      onToggleLog,
      onToggleUpdates,
      onToggleGraph,
    } = this.props;

    return (
      <div>
        <div className={css.panel}>
          {/*
           <a
           href="https://mweststrate.github.io/mobservable/"
           target="_blank"
           className={css.logo}
           />
           */}
          <button
            className={classNames(css.button, css.buttonUpdates, { [css.active]: updatesEnabled })}
            onClick={onToggleUpdates}
          />
          <button
            className={classNames(css.button, css.buttonGraph, { [css.active]: graphEnabled })}
            onClick={onToggleGraph}
          />
          <button
            className={classNames(css.button, css.buttonLog, { [css.active]: logEnabled })}
            onClick={onToggleLog}
          />
        </div>
      </div>
    );
  }
}

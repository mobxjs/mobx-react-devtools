import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ModalContainer from '../ModalContainer';
import css from './graph.css';


export default class Graph extends Component {

  static propTypes = {
    dependencyTree: PropTypes.any,
    onClose: PropTypes.func.isRequired,
  };

  handleClose = () => this.props.onClose();

  renderTree({ name, dependencies }) {
    return (
      <div className={css.item}>
        <span className={classNames(css.box)}>{name}</span>
        {dependencies &&
          <div className={css.tree}>
            {dependencies.map(dependency => this.renderTree(dependency))}
          </div>
        }
      </div>
    );
  }

  render() {
    const { dependencyTree } = this.props;
    return (
      <ModalContainer onOverlayClick={this.handleClose}>
        {dependencyTree &&
          <div className={css.graph}>
            <span className={css.close} onClick={this.handleClose} />
            <ul className={css.tree}>
              {this.renderTree(dependencyTree)}
            </ul>
          </div>
        }
      </ModalContainer>
    );
  }
}

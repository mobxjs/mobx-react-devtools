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

  renderTreeItem({ name, dependencies }) {
    return (
      <div className={css.item} key={name}>
        <span className={classNames(css.box)}>{name}</span>
        {dependencies &&
          <div className={css.tree}>
            {dependencies.map(dependency => this.renderTreeItem(dependency))}
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
            <div className={css.tree}>
              {this.renderTreeItem(dependencyTree)}
            </div>
          </div>
        }
      </ModalContainer>
    );
  }
}

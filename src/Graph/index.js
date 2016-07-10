import React, { Component, PropTypes } from 'react';
import ModalContainer from '../ModalContainer';
import * as styles from './styles.js';

export default class Graph extends Component {

  static propTypes = {
    dependencyTree: PropTypes.any,
    onClose: PropTypes.func.isRequired,
  };

  handleClose = () => this.props.onClose();

  renderTreeItem({ name, dependencies }, isLast, isRoot) {
    return (
      <div style={styles.item} key={name}>
        <span style={Object.assign({}, styles.box, isRoot && styles.box.root)}>{name}</span>
        {dependencies &&
          <div style={styles.tree}>
            {dependencies.map((dependency, i) =>
              this.renderTreeItem(dependency, /*isLast:*/i == dependencies.length - 1))
            }
          </div>
        }
        {!isRoot && <span style={styles.itemHorisontalDash} />}
        {!isRoot && <span style={Object.assign({}, styles.itemVericalStick, isLast && styles.itemVericalStick.short)} />}
      </div>
    );
  }

  render() {
    const { dependencyTree } = this.props;
    return (
      <ModalContainer onOverlayClick={this.handleClose}>
        {dependencyTree &&
          <div style={styles.graph}>
            <span style={styles.close} onClick={this.handleClose}>×</span>
            <div style={styles.tree}>
              {this.renderTreeItem(dependencyTree, /*isLast:*/true, /*isRoot:*/true)}
            </div>
          </div>
        }
      </ModalContainer>
    );
  }
};
